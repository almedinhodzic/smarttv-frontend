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

const CATEGORY_CONTENTS_QUERY = (libraryId: string, categoryId: string, count = 50) => `{
  category(categoryId: "${categoryId}", libraryId: "${libraryId}") {
    id
    contentConnection(first: ${count}) {
      contents {
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
      }
    }
  }
}`

interface VodState {
  libraries: VodLibraryInfoDto[]
  categories: Category[]
  selectedCategoryIndex: number
  contents: VodContent[]
  isLoadingLibraries: boolean
  isLoadingCategories: boolean
  isLoadingContents: boolean
  error: string
  libraryId: string

  fetchLibraries: (regionId: string, language: string) => Promise<void>
  fetchCategories: (profileId: string, libraryId: string) => Promise<void>
  fetchCategoryContents: (profileId: string, libraryId: string, categoryId: string) => Promise<void>
  setSelectedCategoryIndex: (index: number) => void
}

export const useVodStore = create<VodState>((set, get) => ({
  libraries: [],
  categories: [],
  selectedCategoryIndex: 0,
  contents: [],
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
      const body = { query: LIBRARY_QUERY(libraryId) }
      console.log('[VOD] fetchCategories profileId:', profileId, 'libraryId:', libraryId)
      console.log('[VOD] GraphQL body:', JSON.stringify(body))
      const res = await sdk.vod.getVodLibrary(profileId, body)
      const data = (res as any)?.data?.vodLibrary ?? res
      const cats: Category[] = data?.categories || []
      set({ categories: cats, isLoadingCategories: false, selectedCategoryIndex: 0 })

      // Auto-fetch first category contents
      if (cats.length > 0) {
        get().fetchCategoryContents(profileId, libraryId, cats[0].id)
      }
    } catch (e: any) {
      console.error('[VOD] fetchCategories error:', e?.response?.status, e?.response?.data, e)
      set({ error: e instanceof Error ? e.message : 'Failed to load categories', isLoadingCategories: false })
    }
  },

  fetchCategoryContents: async (profileId, libraryId, categoryId) => {
    set({ isLoadingContents: true })
    try {
      const res = await sdk.vod.getCategory(profileId, {
        query: CATEGORY_CONTENTS_QUERY(libraryId, categoryId),
      })
      const data = (res as any)?.data?.category ?? res
      const contents: VodContent[] = data?.contentConnection?.contents || []
      set({ contents, isLoadingContents: false })
    } catch (e) {
      set({ contents: [], isLoadingContents: false })
    }
  },

  setSelectedCategoryIndex: (index) => set({ selectedCategoryIndex: index }),
}))
