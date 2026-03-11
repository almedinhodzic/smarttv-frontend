import { create } from 'zustand'
import type { Channel, Category } from '@/types'

interface ChannelState {
  channels: Channel[]
  categories: Category[]
  currentChannel: Channel | null
  currentIndex: number
  favorites: (string | number)[]
  isLoading: boolean
  setChannels: (channels: Channel[]) => void
  setCategories: (categories: Category[]) => void
  selectChannel: (channel: Channel, index: number) => void
  nextChannel: () => void
  prevChannel: () => void
  toggleFavorite: (channelId: string | number) => void
  loadFavorites: () => void
}

export const useChannelStore = create<ChannelState>((set, get) => ({
  channels: [],
  categories: [],
  currentChannel: null,
  currentIndex: 0,
  favorites: [],
  isLoading: false,

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
}))
