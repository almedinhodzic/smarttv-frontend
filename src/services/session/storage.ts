import type { SelectedProfile } from './types'

const ACCESS = 'auth.accessToken'
const REFRESH = 'auth.refreshToken'
const PROFILE = 'session.profile'

export function loadTokens(): { accessToken?: string; refreshToken?: string } {
  return {
    accessToken: localStorage.getItem(ACCESS) ?? undefined,
    refreshToken: localStorage.getItem(REFRESH) ?? undefined,
  }
}

export function saveTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS, accessToken)
  localStorage.setItem(REFRESH, refreshToken)
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS)
  localStorage.removeItem(REFRESH)
}

export function loadSelectedProfile(): SelectedProfile | undefined {
  const raw = localStorage.getItem(PROFILE)
  if (!raw) return undefined
  try {
    return JSON.parse(raw) as SelectedProfile
  } catch {
    return undefined
  }
}

export function saveSelectedProfile(profile: SelectedProfile): void {
  localStorage.setItem(PROFILE, JSON.stringify(profile))
}

export function clearSelectedProfile(): void {
  localStorage.removeItem(PROFILE)
}
