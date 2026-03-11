import { create } from 'zustand'

interface Settings {
  language: string
  theme: string
  epgTimeFormat: string
  parentalPin: string | null
  autoPlay: boolean
  bufferSize: string
  subtitles: boolean
  audioTrack: string
}

interface SettingsState extends Settings {
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void
  resetSettings: () => void
}

const DEFAULTS: Settings = {
  language: 'en',
  theme: 'dark',
  epgTimeFormat: '24h',
  parentalPin: null,
  autoPlay: true,
  bufferSize: 'medium',
  subtitles: false,
  audioTrack: 'default',
}

function loadSettings(): Settings {
  try {
    const stored = localStorage.getItem('settings')
    return stored ? { ...DEFAULTS, ...JSON.parse(stored) } : { ...DEFAULTS }
  } catch (_e) {
    return { ...DEFAULTS }
  }
}

function persistSettings(settings: Settings): void {
  try { localStorage.setItem('settings', JSON.stringify(settings)) } catch (_e) { /* noop */ }
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...loadSettings(),

  setSetting: (key, value) => {
    set({ [key]: value } as Partial<SettingsState>)
    const state = get()
    const settings: Settings = {
      language: state.language,
      theme: state.theme,
      epgTimeFormat: state.epgTimeFormat,
      parentalPin: state.parentalPin,
      autoPlay: state.autoPlay,
      bufferSize: state.bufferSize,
      subtitles: state.subtitles,
      audioTrack: state.audioTrack,
    }
    persistSettings(settings)
  },

  resetSettings: () => {
    set({ ...DEFAULTS })
    persistSettings(DEFAULTS)
  },
}))
