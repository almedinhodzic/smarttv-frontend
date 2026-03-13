/**
 * Unified platform API — auto-detects platform and provides
 * consistent interface across Tizen, webOS, and browser.
 */

import { detectPlatform, PLATFORM } from './detect'
import { tizenExit, tizenGetDeviceInfo, tizenRegisterKeys } from './tizen'
import { webosExit, webosGetDeviceInfo, webosKeepAlive } from './webos'

export { PLATFORM, detectPlatform, isTizen, isWebOS, isBrowser } from './detect'

const DEVICE_UID_KEY = 'device_uid'

export function getDeviceUid(): string {
  const platform = detectPlatform()

  // Tizen: use DUID
  if (platform === PLATFORM.TIZEN) {
    try {
      const duid = window.webapis?.productinfo?.getDuid?.()
      if (duid) return duid
    } catch (_e) { /* fallback */ }
  }

  // webOS: try device ID from system
  if (platform === PLATFORM.WEBOS) {
    try {
      const id = (window as any).PalmSystem?.identifier
      if (id) return id
    } catch (_e) { /* fallback */ }
  }

  // Browser fallback: persistent random UUID in localStorage
  let uid = ''
  try { uid = localStorage.getItem(DEVICE_UID_KEY) || '' } catch (_e) { /* noop */ }
  if (!uid) {
    uid = 'browser-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
    try { localStorage.setItem(DEVICE_UID_KEY, uid) } catch (_e) { /* noop */ }
  }
  return uid
}

export function platformInit() {
  const platform = detectPlatform()

  if (platform === PLATFORM.TIZEN) {
    tizenRegisterKeys()
  } else if (platform === PLATFORM.WEBOS) {
    webosKeepAlive()
  }

  return platform
}

export function platformExit() {
  const platform = detectPlatform()
  if (platform === PLATFORM.TIZEN) tizenExit()
  else if (platform === PLATFORM.WEBOS) webosExit()
  else window.close()
}

export async function platformDeviceInfo() {
  const platform = detectPlatform()
  if (platform === PLATFORM.TIZEN) return tizenGetDeviceInfo()
  if (platform === PLATFORM.WEBOS) return webosGetDeviceInfo()
  return { model: 'Browser', firmware: navigator.userAgent, platform: 'browser' }
}
