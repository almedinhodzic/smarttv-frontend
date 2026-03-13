import { create } from 'zustand'
import { sdk } from '@/services/sdkInstance'
import { getDeviceUid } from '@/platform'
import { useToastStore } from './toastStore'
import type {
  Category,
  VodContent,
  VodLibraryInfoDto,
} from '@/services/sdk/src/models/vod'

const CATEGORY_FILTER = [
  'CONTINUE_WATCHING',
  'FAVORITE',
  'MOST_PURCHASED',
  'MOST_WATCHED',
  'RECOMMENDED',
  'STORE_CATEGORIES',
  'TOP',
  'ALL',
]

const LIBRARY_QUERY = (libraryId: string) => `{
  vodLibrary(libraryId: "${libraryId}", categoryFilter: [${CATEGORY_FILTER.join(', ')}]) {
    id
    title
    categories {
      id
      title
      tag
      poster { landscape portrait }
      ageRating
      isLeaf
      contentConnection(first: 20, randomize: true) {
        contentCount
        contents {
          categoryId
          poster { landscape portrait }
          ageRating
        }
      }
    }
  }
}`

const SUBCATEGORIES_QUERY = (libraryId: string, categoryId: string) => `{
  category(categoryId: "${categoryId}", libraryId: "${libraryId}") {
    id
    title
    subcategories {
      id
      title
      tag
      poster { landscape portrait }
      ageRating
      isLeaf
      contentConnection(first: 20, randomize: true) {
        contentCount
        contents {
          categoryId
          poster { landscape portrait }
          ageRating
        }
      }
    }
  }
}`

const CONTENT_FIELDS = `
  id
  type
  categoryId
  isFavorite
  isNew
  title
  poster { landscape portrait }
  ageRating
  description
  year
  genres
  contentActions {
    favorite
    unfavorite
    resumePlay { mediaId offset }
  }
  purchaseInfo {
    status
    libraryId
  }
  ... on Video {
    runtimeInMinutes
    directors
    cast
  }
  ... on Series {
    seriesId
    contentCount
  }
`

const CONTENT_QUERY = (contentId: string, libraryId: string, categoryId = '') => `{
  contents(contentIds: ["${contentId}"], libraryId: "${libraryId}", categoryId: "${categoryId}") {
    ${CONTENT_FIELDS}
    summary
  }
}`

const CATEGORY_CONTENTS_QUERY = (libraryId: string, categoryId: string, count = 50) => `{
  category(categoryId: "${categoryId}", libraryId: "${libraryId}") {
    id
    contentConnection(first: ${count}) {
      contents {
        ${CONTENT_FIELDS}
      }
    }
  }
}`

export interface ContentRow {
  title: string
  categoryId: string
  contents: VodContent[]
}

interface VodState {
  libraries: VodLibraryInfoDto[]
  categories: Category[]
  selectedCategoryIndex: number
  rows: ContentRow[]
  detailContent: VodContent | null
  isLoadingLibraries: boolean
  isLoadingCategories: boolean
  isLoadingContents: boolean
  isLoadingDetail: boolean
  error: string
  libraryId: string

  fetchLibraries: (regionId: string, language: string) => Promise<void>
  fetchCategories: (profileId: string, libraryId: string) => Promise<void>
  fetchCategoryData: (profileId: string, libraryId: string, category: Category) => Promise<void>
  fetchContentById: (profileId: string, contentId: string, regionId?: string, language?: string) => Promise<void>
  setSelectedCategoryIndex: (index: number) => void
  toggleFavorite: (contentId: string) => Promise<void>
}

export const useVodStore = create<VodState>((set, get) => ({
  libraries: [],
  categories: [],
  selectedCategoryIndex: 0,
  rows: [],
  detailContent: null,
  isLoadingLibraries: false,
  isLoadingCategories: false,
  isLoadingContents: false,
  isLoadingDetail: false,
  error: '',
  libraryId: '',

  fetchLibraries: async (regionId, language) => {
    set({ isLoadingLibraries: true, error: '' })
    try {
      const res = await sdk.vod.getVodLibraries(regionId, { language, type: 'on-demand' })
      const list = Array.isArray(res) ? res : (res as any)?.list || []
      set({ libraries: list, isLoadingLibraries: false })
    } catch (e) {
      set({ error: e instanceof Error ? e.message : 'Failed to load libraries', isLoadingLibraries: false })
    }
  },

  fetchCategories: async (profileId, libraryId) => {
    set({ isLoadingCategories: true, error: '', libraryId })
    try {
      const res = await sdk.vod.getVodLibrary(profileId, {
        query: LIBRARY_QUERY(libraryId),
      })
      const data = (res as any)?.data?.vodLibrary ?? res
      const cats: Category[] = data?.categories || []
      set({ categories: cats, isLoadingCategories: false, selectedCategoryIndex: 0 })

      if (cats.length > 0) {
        get().fetchCategoryData(profileId, libraryId, cats[0])
      }
    } catch (e: any) {
      console.error('[VOD] fetchCategories error:', e?.response?.status, e?.response?.data)
      set({ error: e instanceof Error ? e.message : 'Failed to load categories', isLoadingCategories: false })
    }
  },

  fetchCategoryData: async (profileId, libraryId, category) => {
    set({ isLoadingContents: true, rows: [] })
    try {
      const isLeaf = String(category.isLeaf) === 'true'
      if (isLeaf) {
        // Leaf category: fetch contents directly, single row without title
        const res = await sdk.vod.getCategory(profileId, {
          query: CATEGORY_CONTENTS_QUERY(libraryId, category.id),
        })
        const data = (res as any)?.data?.category ?? res
        const contents: VodContent[] = data?.contentConnection?.contents || []
        set({
          rows: contents.length > 0 ? [{ title: '', categoryId: category.id, contents }] : [],
          isLoadingContents: false,
        })
      } else {
        // Non-leaf: fetch subcategories, then fetch each subcategory's contents
        const subRes = await sdk.vod.getCategory(profileId, {
          query: SUBCATEGORIES_QUERY(libraryId, category.id),
        })
        const subData = (subRes as any)?.data?.category ?? subRes
        const subcats: Category[] = subData?.subcategories || []

        if (subcats.length === 0) {
          set({ rows: [], isLoadingContents: false })
          return
        }

        // Fetch contents for all subcategories in parallel
        const rowPromises = subcats.map(async (sub) => {
          try {
            const res = await sdk.vod.getCategory(profileId, {
              query: CATEGORY_CONTENTS_QUERY(libraryId, sub.id),
            })
            const d = (res as any)?.data?.category ?? res
            const contents: VodContent[] = d?.contentConnection?.contents || []
            return { title: sub.title, categoryId: sub.id, contents }
          } catch {
            return { title: sub.title, categoryId: sub.id, contents: [] as VodContent[] }
          }
        })

        const allRows = await Promise.all(rowPromises)
        // Only show rows that have content
        set({
          rows: allRows.filter((r) => r.contents.length > 0),
          isLoadingContents: false,
        })
      }
    } catch (e) {
      console.error('[VOD] fetchCategoryData error:', e)
      set({ rows: [], isLoadingContents: false })
    }
  },

  fetchContentById: async (profileId, contentId, regionId?, language?) => {
    // First check if already in rows cache
    const { rows } = get()
    for (const row of rows) {
      const found = row.contents.find((c) => c.id === contentId)
      if (found) {
        set({ detailContent: found, isLoadingDetail: false })
        return
      }
    }

    set({ isLoadingDetail: true, detailContent: null })

    // Resolve libraryId — fetch libraries if needed
    let libId = get().libraryId
    if (!libId && regionId) {
      try {
        const res = await sdk.vod.getVodLibraries(regionId, { language: language || 'en', type: 'on-demand' })
        const list = Array.isArray(res) ? res : (res as any)?.list || []
        if (list.length > 0) {
          libId = list[0].id
          set({ libraries: list, libraryId: libId })
        }
      } catch (e) {
        console.error('[VOD] fetchLibraries for detail error:', e)
      }
    }

    if (!libId) {
      set({ detailContent: null, isLoadingDetail: false })
      return
    }

    try {
      const res = await sdk.vod.getVodContent(profileId, {
        query: CONTENT_QUERY(contentId, libId),
      })
      const contents = (res as any)?.data?.contents ?? []
      const data = Array.isArray(contents) ? contents[0] : null
      set({ detailContent: data || null, isLoadingDetail: false })
    } catch (e) {
      console.error('[VOD] fetchContentById error:', e)
      set({ detailContent: null, isLoadingDetail: false })
    }
  },

  setSelectedCategoryIndex: (index) => set({ selectedCategoryIndex: index }),

  toggleFavorite: async (contentId: string) => {
    const { rows } = get()
    // Find the content to get its contentActions and isFavorite state
    let target: VodContent | null = null
    for (const row of rows) {
      const found = row.contents.find((c) => c.id === contentId)
      if (found) { target = found; break }
    }
    if (!target) return

    const isFavorite = target.isFavorite
    const urls = isFavorite
      ? target.contentActions?.unfavorite
      : target.contentActions?.favorite

    if (!urls || urls.length === 0) return

    // Optimistic update: flip isFavorite and swap contentActions URLs
    const updated = rows.map((row) => ({
      ...row,
      contents: row.contents.map((c) =>
        c.id === contentId
          ? {
              ...c,
              isFavorite: !isFavorite,
              contentActions: {
                ...c.contentActions,
                favorite: c.contentActions?.unfavorite || [],
                unfavorite: c.contentActions?.favorite || [],
              },
            }
          : c,
      ),
    }))
    set({ rows: updated })

    const deviceUid = getDeviceUid()
    const title = target.title || 'Content'
    try {
      for (const url of urls) {
        if (isFavorite) {
          await sdk.vod.unMarkAsFavorite(url, { device_uid: deviceUid })
        } else {
          await sdk.vod.markAsFavorite(url, { device_uid: deviceUid })
        }
      }
      useToastStore.getState().show(
        isFavorite ? `${title} removed from Favorites` : `${title} added to Favorites`
      )
    } catch (e) {
      // Revert on failure
      console.error('[VOD] toggleFavorite error:', e)
      set({ rows })
      useToastStore.getState().show('Failed to update favorites')
    }
  },
}))
