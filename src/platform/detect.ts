/**
 * Platform detection — runs once at startup.
 * Detects Tizen, webOS, or falls back to browser (dev mode).
 */

export const PLATFORM = {
  TIZEN: 'tizen',
  WEBOS: 'webos',
  BROWSER: 'browser',
}

let detected = null

export function detectPlatform() {
  if (detected) return detected

  if (typeof window.tizen !== 'undefined') {
    detected = PLATFORM.TIZEN
  } else if (typeof window.webOS !== 'undefined' || typeof window.webOSSystem !== 'undefined') {
    detected = PLATFORM.WEBOS
  } else {
    detected = PLATFORM.BROWSER
  }

  return detected
}

export function isTizen() {
  return detectPlatform() === PLATFORM.TIZEN
}

export function isWebOS() {
  return detectPlatform() === PLATFORM.WEBOS
}

export function isBrowser() {
  return detectPlatform() === PLATFORM.BROWSER
}
