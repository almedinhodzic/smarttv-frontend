import { create } from 'zustand'
import type { SessionState, SessionUser, SelectedProfile } from '@/services/session'
import {
  getInitialSession,
  applyLogin,
  applyLogout,
  applySelectProfile,
  isTokenExpired,
} from '@/services/session'
import { sdk } from '@/services/sdkInstance'

interface SessionStore extends SessionState {
  login: (accessToken: string, refreshToken: string) => void
  logout: () => Promise<void>
  selectProfile: (profile: SelectedProfile) => void
  refreshIfNeeded: () => Promise<boolean>
  init: () => void
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  ...getInitialSession(),

  init: () => {
    const session = getInitialSession()
    set(session)
    if (session.accessToken) {
      sdk.setAuthToken(session.accessToken)
    }
  },

  login: (accessToken, refreshToken) => {
    const current = get()
    const next = applyLogin(current, accessToken, refreshToken)
    sdk.setAuthToken(accessToken)
    set(next)
  },

  logout: async () => {
    try {
      await sdk.auth.deauthenticate().catch(() => {})
    } catch (_e) { /* noop */ }
    sdk.clearAuthToken()
    set(applyLogout())
  },

  selectProfile: (profile) => {
    const current = get()
    set(applySelectProfile(current, profile))
  },

  refreshIfNeeded: async () => {
    const { accessToken, refreshToken } = get()

    if (!accessToken || !isTokenExpired(accessToken)) {
      return true // Token is still valid
    }

    if (!refreshToken) {
      set(applyLogout())
      return false
    }

    try {
      const res = await sdk.auth.refreshToken(refreshToken)
      const current = get()
      const next = applyLogin(current, res.access_token, res.refresh_token)
      sdk.setAuthToken(res.access_token)
      set(next)
      return true
    } catch (_e) {
      sdk.clearAuthToken()
      set(applyLogout())
      return false
    }
  },
}))
