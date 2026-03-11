/**
 * SDK singleton instance.
 * Initialized once at app startup with config from .env.
 * Import this anywhere to access SDK services.
 *
 * Usage:
 *   import { sdk } from '@/services/sdkInstance'
 *   const channels = await sdk.channel.getChannels(...)
 */

import { SmartTvSdk } from '@sdk'

const baseUrl = import.meta.env.VITE_API_BASE_URL as string
const debug = import.meta.env.VITE_DEBUG === 'true'

if (!baseUrl) {
  throw new Error('VITE_API_BASE_URL is not set in .env')
}

export const sdk = new SmartTvSdk({
  baseUrl,
  debug,
})
