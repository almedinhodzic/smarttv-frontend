import { create } from 'zustand'
import type { Channel, Category } from '@/types'
import { sdk } from '@/services/sdkInstance'
import { resolveApiUrl } from '@/utils/resolveApiUrl'
import type { Channel as SdkChannel } from '@/services/sdk/src/models/channel'

interface ChannelState {
  channels: Channel[]
  categories: Category[]
  currentChannel: Channel | null
  currentIndex: number
  favorites: (string | number)[]
  isLoading: boolean
  error: string
  setChannels: (channels: Channel[]) => void
  setCategories: (categories: Category[]) => void
  selectChannel: (channel: Channel, index: number) => void
  nextChannel: () => void
  prevChannel: () => void
  toggleFavorite: (channelId: string | number) => void
  loadFavorites: () => void
  fetchChannels: (regionId: string, userId?: string, language?: string) => Promise<void>
}

export const useChannelStore = create<ChannelState>((set, get) => ({
  channels: [],
  categories: [],
  currentChannel: null,
  currentIndex: 0,
  favorites: [],
  isLoading: false,
  error: '',

  setChannels: (channels) => set({ channels }),
  setCategories: (categories) => set({ categories }),

  selectChannel: (channel, index) => {
    set({ currentChannel: channel, currentIndex: index })
  },

  nextChannel: () => {
    const { channels, currentIndex } = get()
    if (!channels.length) return
    const nextIdx = (currentIndex + 1) % channels.length
    set({ currentChannel: channels[nextIdx], currentIndex: nextIdx })
  },

  prevChannel: () => {
    const { channels, currentIndex } = get()
    if (!channels.length) return
    const prevIdx = currentIndex <= 0 ? channels.length - 1 : currentIndex - 1
    set({ currentChannel: channels[prevIdx], currentIndex: prevIdx })
  },

  toggleFavorite: (channelId) => {
    const { favorites } = get()
    const next = favorites.includes(channelId)
      ? favorites.filter((id) => id !== channelId)
      : [...favorites, channelId]
    set({ favorites: next })
    try { localStorage.setItem('favorites', JSON.stringify(next)) } catch (_e) { /* noop */ }
  },

  loadFavorites: () => {
    try {
      const stored = localStorage.getItem('favorites')
      if (stored) set({ favorites: JSON.parse(stored) })
    } catch (_e) { /* noop */ }
  },

  fetchChannels: async (regionId, userId, language = 'en') => {
    set({ isLoading: true, error: '' })
    try {
      const [regionalRes, userRes] = await Promise.all([
        sdk.channel
          .getChannels(regionId, {
            channel_type: 'all',
            page_size: '500',
            language,
            include_details: 'true',
          })
          .catch(() => ({ list: [] as SdkChannel[] })),

        userId
          ? sdk.channel
              .getUserChannels(regionId, userId, { language })
              .catch(() => ({ list: [] as SdkChannel[] }))
          : Promise.resolve({ list: [] as SdkChannel[] }),
      ])

      // Build user override map
      const userOverrides: Record<string, { name?: string; number?: number }> = {}
      for (const uc of (userRes as any)?.list || []) {
        if (!uc.id) continue
        userOverrides[String(uc.id)] = {
          name: uc.name || undefined,
          number: uc.number ?? undefined,
        }
      }

      // Merge and filter
      const raw: SdkChannel[] = (regionalRes as any)?.list || []
      const channels: Channel[] = raw
        .filter((c) => (c.type === 'video' || c.type === 'audio') && c.number > 0)
        .map((c) => {
          const cid = String(c.id)
          const ov = userOverrides[cid] || {}
          return {
            id: cid,
            num: ov.number ?? c.number ?? 0,
            name: ov.name ?? c.name ?? 'Unknown',
            icon: c.icon ? resolveApiUrl(c.icon) : '',
            type: c.type || 'video',
            hd: c.hd ?? false,
            quality: c.quality,
            purchaseStatus: 'FREE' as const,
            streams: c.streams || [],
          }
        })
        .sort((a, b) => b.num - a.num)

      const lastIdx = channels.length - 1
      set({
        channels,
        currentChannel: channels[lastIdx] || null,
        currentIndex: lastIdx >= 0 ? lastIdx : 0,
        isLoading: false,
      })
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : 'Failed to load channels',
        isLoading: false,
      })
    }
  },
}))
