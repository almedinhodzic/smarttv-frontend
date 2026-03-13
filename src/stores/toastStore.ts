import { create } from 'zustand'

interface ToastState {
  message: string
  visible: boolean
  show: (message: string, duration?: number) => void
}

let hideTimer: ReturnType<typeof setTimeout> | null = null

export const useToastStore = create<ToastState>((set) => ({
  message: '',
  visible: false,
  show: (message: string, duration = 2500) => {
    if (hideTimer) clearTimeout(hideTimer)
    set({ message, visible: true })
    hideTimer = setTimeout(() => {
      set({ visible: false })
      hideTimer = null
    }, duration)
  },
}))
