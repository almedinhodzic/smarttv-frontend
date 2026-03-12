import { create } from 'zustand'
import { sdk } from '@/services/sdkInstance'
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
  isLoadingLibraries: boolean
  isLoadingCategories: boolean
  isLoadingContents: boolean
  error: string
  libraryId: string

  fetchLibraries: (regionId: string, language: string) => Promise<void>
  fetchCategories: (profileId: string, libraryId: string) => Promise<void>
  fetchCategoryData: (profileId: string, libraryId: string, category: Category) => Promise<void>
  setSelectedCategoryIndex: (index: number) => void
}

export const useVodStore = create<VodState>((set, get) => ({
  libraries: [],
  categories: [],
  selectedCategoryIndex: 0,
  rows: [],
  isLoadingLibraries: false,
  isLoadingCategories: false,
  isLoadingContents: false,
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

  setSelectedCategoryIndex: (index) => set({ selectedCategoryIndex: index }),
}))
