export interface SessionUser {
  userId: string
  regionIds: string[]
  roles: string[]
  type: string
  subject: string
}

export interface SelectedProfile {
  id: string
  idProfile?: number
  name: string
  nickname?: string
  ageRating?: number
  language?: string
  isDefault?: boolean
  avatarResourceLink?: string
  pinValidTill?: number
}

export interface SessionState {
  isAuthenticated: boolean
  accessToken?: string
  refreshToken?: string
  user?: SessionUser
  selectedProfile?: SelectedProfile
}
