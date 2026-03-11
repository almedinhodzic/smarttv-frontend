// ============ Platform ============

export type Platform = 'tizen' | 'webos' | 'browser'

export interface DeviceInfo {
  model: string
  firmware: string
  duid?: string
  uhd?: boolean
  platform?: string
}

// ============ Channel / IPTV ============

export type PurchaseStatus =
  | 'FREE'
  | 'PURCHASED'
  | 'IN_OTHER_SUBSCRIPTION'
  | 'PAYABLE'
  | 'PREORDERED'
  | 'CALL_OPERATOR'
  | 'UNAVAILABLE'

export interface Channel {
  id: string
  num: number
  name: string
  icon: string
  type: string
  hd: boolean
  quality?: string
  purchaseStatus: PurchaseStatus
  streams?: unknown[]
  url?: string
  logo?: string
  group?: string
  epgId?: string
}

export interface Category {
  id: string
  name: string
  channels?: Channel[]
}

// ============ EPG ============

export interface EpgProgram {
  id: string
  channelId: string
  title: string
  description?: string
  start: number  // unix timestamp
  end: number
  icon?: string
}

// ============ VOD / Series ============

export interface VodItem {
  id: string | number
  name: string
  url: string
  poster?: string
  plot?: string
  year?: string
  genre?: string
  rating?: string
  duration?: string
}

export interface SeriesInfo {
  id: string | number
  name: string
  poster?: string
  plot?: string
  year?: string
  genre?: string
  rating?: string
  seasons: Season[]
}

export interface Season {
  number: number
  episodes: Episode[]
}

export interface Episode {
  id: string | number
  number: number
  name: string
  url: string
  plot?: string
  duration?: string
  poster?: string
}

// ============ User / Auth ============

export interface User {
  id: string
  username: string
  status: string
  expDate?: string
  maxConnections?: number
  activeCons?: number
}

export interface AuthCredentials {
  username: string
  password: string
  server?: string
}

// ============ Messages / Notifications ============

export interface Message {
  id: string
  title: string
  body: string
  date: string
  read: boolean
}

// ============ Player ============

export type PlayerState = 'idle' | 'loading' | 'playing' | 'paused' | 'stopped' | 'error'

export interface PlayerCallbacks {
  onbufferingstart?: () => void
  onbufferingcomplete?: () => void
  onstreamcompleted?: () => void
  onerror?: (error: unknown) => void
  oncurrentplaytime?: (ms: number) => void
}
