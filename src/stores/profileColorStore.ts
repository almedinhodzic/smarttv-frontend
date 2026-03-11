import { create } from 'zustand'

export const PROFILE_COLORS = [
  { id: 'user_color_00', hex: '#C42E26', label: 'Red' },
  { id: 'user_color_01', hex: '#FBB03B', label: 'Light Orange' },
  { id: 'user_color_02', hex: '#6D6E70', label: 'Dark Gray' },
  { id: 'user_color_03', hex: '#0B888E', label: 'Dark Green' },
  { id: 'user_color_04', hex: '#AA54A0', label: 'Purple' },
  { id: 'user_color_05', hex: '#BF5427', label: 'Dark Red' },
  { id: 'user_color_06', hex: '#00B2CE', label: 'Cyan' },
  { id: 'user_color_07', hex: '#A7A9AB', label: 'Light Gray' },
  { id: 'user_color_08', hex: '#F5821F', label: 'Dark Orange' },
  { id: 'user_color_09', hex: '#01517C', label: 'Dark Blue' },
] as const

export const DEFAULT_COLOR = '#161616'

const STORAGE_KEY = 'profile.colors'

type ColorMap = Record<string, string>

function loadColors(): ColorMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveColors(map: ColorMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}

interface ProfileColorStore {
  colorMap: ColorMap
  getColor: (profileId: string) => string
  setColor: (profileId: string, hex: string) => void
}

export const useProfileColorStore = create<ProfileColorStore>((set, get) => ({
  colorMap: loadColors(),

  getColor: (profileId: string) => {
    return get().colorMap[profileId] || DEFAULT_COLOR
  },

  setColor: (profileId: string, hex: string) => {
    const next = { ...get().colorMap, [profileId]: hex }
    saveColors(next)
    set({ colorMap: next })
  },
}))
