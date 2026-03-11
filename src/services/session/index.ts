import type { SelectedProfile, SessionState } from './types'
import { deriveUserFromAccessToken } from './deriveUser'
import {
  loadTokens,
  loadSelectedProfile,
  saveTokens,
  clearTokens,
  saveSelectedProfile,
  clearSelectedProfile,
} from './storage'

export type { SessionState, SessionUser, SelectedProfile } from './types'
export { decodeJwt, isTokenExpired } from './jwt'
export { deriveUserFromAccessToken } from './deriveUser'

export function getInitialSession(): SessionState {
  const { accessToken, refreshToken } = loadTokens()
  const selectedProfile = loadSelectedProfile()

  return {
    isAuthenticated: !!accessToken,
    accessToken,
    refreshToken,
    user: deriveUserFromAccessToken(accessToken),
    selectedProfile,
  }
}

export function applyLogin(
  state: SessionState,
  accessToken: string,
  refreshToken: string,
): SessionState {
  saveTokens(accessToken, refreshToken)
  return {
    ...state,
    isAuthenticated: true,
    accessToken,
    refreshToken,
    user: deriveUserFromAccessToken(accessToken),
  }
}

export function applyLogout(): SessionState {
  clearTokens()
  clearSelectedProfile()
  return { isAuthenticated: false }
}

export function applySelectProfile(
  state: SessionState,
  profile: SelectedProfile,
): SessionState {
  saveSelectedProfile(profile)
  return { ...state, selectedProfile: profile }
}

export function hasSelectedProfile(state: SessionState): boolean {
  return !!state.selectedProfile?.id
}
