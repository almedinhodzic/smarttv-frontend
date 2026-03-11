/**
 * Lightweight API client — no axios, just native fetch.
 * Handles auth token injection and base URL configuration.
 */

interface ApiError extends Error {
  status?: number
  data?: unknown
}

let baseUrl = ''

export function setApiBaseUrl(url: string): void {
  baseUrl = url.replace(/\/$/, '')
}

async function request<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token')
  const url = baseUrl + endpoint

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }

  if (token) {
    headers['Authorization'] = 'Bearer ' + token
  }

  const response = await fetch(url, { ...options, headers })

  if (!response.ok) {
    const error: ApiError = new Error('API Error: ' + response.status)
    error.status = response.status
    try { error.data = await response.json() } catch (_e) { /* noop */ }
    throw error
  }

  return response.json()
}

export const api = {
  get: <T = unknown>(endpoint: string) => request<T>(endpoint),
  post: <T = unknown>(endpoint: string, body: unknown) => request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T = unknown>(endpoint: string, body: unknown) => request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T = unknown>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
}
