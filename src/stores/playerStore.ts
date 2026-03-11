import { create } from 'zustand'

interface PlayerStoreState {
  isPlaying: boolean
  isBuffering: boolean
  isMuted: boolean
  volume: number
  currentUrl: string | null
  error: string | null
  duration: number
  currentTime: number
  setPlaying: (isPlaying: boolean) => void
  setBuffering: (isBuffering: boolean) => void
  setUrl: (url: string) => void
  setError: (error: string) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  setTime: (currentTime: number) => void
  setDuration: (duration: number) => void
  reset: () => void
}

export const usePlayerStore = create<PlayerStoreState>((set) => ({
  isPlaying: false,
  isBuffering: false,
  isMuted: false,
  volume: 100,
  currentUrl: null,
  error: null,
  duration: 0,
  currentTime: 0,

  setPlaying: (isPlaying) => set({ isPlaying }),
  setBuffering: (isBuffering) => set({ isBuffering }),
  setUrl: (url) => set({ currentUrl: url, error: null }),
  setError: (error) => set({ error, isPlaying: false, isBuffering: false }),
  setVolume: (volume) => set({ volume }),
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  setTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),

  reset: () => set({
    isPlaying: false,
    isBuffering: false,
    currentUrl: null,
    error: null,
    duration: 0,
    currentTime: 0,
  }),
}))
