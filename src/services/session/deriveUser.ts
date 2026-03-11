import { decodeJwt } from './jwt'
import type { SessionUser } from './types'

interface JwtPayload {
  sub?: string
  ext?: {
    regionIds?: string[]
    roles?: string[]
    type?: string
    userId?: string
  }
}

export function deriveUserFromAccessToken(accessToken?: string): SessionUser | undefined {
  if (!accessToken) return undefined
  const p = decodeJwt<JwtPayload>(accessToken)
  if (!p?.ext) return undefined

  return {
    userId: p.ext.userId ?? '',
    regionIds: p.ext.regionIds ?? [],
    roles: p.ext.roles ?? [],
    type: p.ext.type ?? '',
    subject: p.sub ?? '',
  }
}
