/**
 * webOS (LG) platform API wrappers
 */

export function webosExit() {
  try {
    window.webOS.platformBack()
  } catch (e) {
    window.close()
  }
}

export function webosGetDeviceInfo() {
  return new Promise((resolve) => {
    try {
      window.webOS.deviceInfo((info) => {
        resolve({
          model: info.modelName || 'unknown',
          firmware: info.sdkVersion || 'unknown',
          uhd: info.uhd || false,
        })
      })
    } catch (e) {
      resolve({ model: 'unknown', firmware: 'unknown', uhd: false })
    }
  })
}

/** Keep webOS screen alive (prevent screensaver) */
export function webosKeepAlive() {
  try {
    window.webOS.service.request('luna://com.webos.service.tvpower', {
      method: 'turnOnScreenSaver',
      parameters: { subscribe: true },
      onSuccess: () => {},
      onFailure: () => {},
    })
  } catch (e) {
    // Fallback — not critical
  }
}

/** webOS Luna service call helper */
export function lunaCall(uri, method, params = {}) {
  return new Promise((resolve, reject) => {
    try {
      window.webOS.service.request(uri, {
        method,
        parameters: params,
        onSuccess: resolve,
        onFailure: reject,
      })
    } catch (e) {
      reject(e)
    }
  })
}
