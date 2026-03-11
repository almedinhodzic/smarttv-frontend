/**
 * Unified platform API — auto-detects platform and provides
 * consistent interface across Tizen, webOS, and browser.
 */

import { detectPlatform, PLATFORM } from './detect'
import { tizenExit, tizenGetDeviceInfo, tizenRegisterKeys } from './tizen'
import { webosExit, webosGetDeviceInfo, webosKeepAlive } from './webos'

export { PLATFORM, detectPlatform, isTizen, isWebOS, isBrowser } from './detect'

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
