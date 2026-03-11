import { create } from 'zustand'
import type { User, AuthCredentials } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (credentials: AuthCredentials) => Promise<void>
  logout: () => void
  restoreSession: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials: AuthCredentials) => {
    set({ isLoading: true, error: null })
    try {
      // TODO: Replace with actual SDK API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Login failed')

      localStorage.setItem('token', data.token)
      set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false })
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Login failed'
      set({ error: msg, isLoading: false })
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null, isAuthenticated: false })
  },

  restoreSession: () => {
    const token = localStorage.getItem('token')
    if (token) {
      set({ token, isAuthenticated: true })
    }
  },
}))
