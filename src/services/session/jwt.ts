function base64UrlDecode(input: string): string {
  const pad = '='.repeat((4 - (input.length % 4)) % 4)
  const b64 = (input + pad).replace(/-/g, '+').replace(/_/g, '/')
  return decodeURIComponent(
    atob(b64)
      .split('')
      .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
      .join('')
  )
}

export function decodeJwt<T = Record<string, unknown>>(token: string): T | null {
  try {
    const [, payload] = token.split('.')
    if (!payload) return null
    return JSON.parse(base64UrlDecode(payload)) as T
  } catch {
    return null
  }
}

export function isTokenExpired(token: string, bufferSeconds = 60): boolean {
  const decoded = decodeJwt<{ exp?: number }>(token)
  if (!decoded || !decoded.exp) return true
  const now = Math.floor(Date.now() / 1000)
  return decoded.exp < now + bufferSeconds
}
