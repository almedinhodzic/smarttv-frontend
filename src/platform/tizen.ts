/**
 * Tizen platform API wrappers
 */

export function tizenExit() {
  try {
    window.tizen.application.getCurrentApplication().exit()
  } catch (e) {
    window.close()
  }
}

export function tizenGetDeviceInfo() {
  try {
    const systemInfo = window.tizen.systeminfo
    return {
      model: systemInfo.getCapability('http://tizen.org/system/model_name'),
      firmware: systemInfo.getCapability('http://tizen.org/system/platform.version'),
      duid: window.webapis?.productinfo?.getDuid?.() || 'unknown',
    }
  } catch (e) {
    return { model: 'unknown', firmware: 'unknown', duid: 'unknown' }
  }
}

export function tizenRegisterKeys() {
  try {
    const keys = [
      'MediaPlay', 'MediaPause', 'MediaStop',
      'MediaRewind', 'MediaFastForward',
      'ColorF0Red', 'ColorF1Green', 'ColorF2Yellow', 'ColorF3Blue',
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      'ChannelUp', 'ChannelDown',
    ]
    keys.forEach((key) => {
      window.tizen.tvinputdevice.registerKey(key)
    })
  } catch (e) {
    console.warn('Failed to register Tizen keys:', e)
  }
}

/** Tizen AVPlay wrapper for video playback */
export const tizenPlayer = {
  open(url) {
    try {
      window.webapis.avplay.open(url)
      window.webapis.avplay.setDisplayRect(0, 0, 1920, 1080)
      window.webapis.avplay.setDisplayMethod('PLAYER_DISPLAY_MODE_FULL_SCREEN')
    } catch (e) {
      console.error('AVPlay open error:', e)
    }
  },

  prepare() {
    return new Promise((resolve, reject) => {
      try {
        window.webapis.avplay.prepareAsync(resolve, reject)
      } catch (e) {
        reject(e)
      }
    })
  },

  play() {
    try { window.webapis.avplay.play() } catch (e) { console.error(e) }
  },

  stop() {
    try { window.webapis.avplay.stop() } catch (e) { console.error(e) }
  },

  pause() {
    try { window.webapis.avplay.pause() } catch (e) { console.error(e) }
  },

  close() {
    try { window.webapis.avplay.close() } catch (e) { console.error(e) }
  },

  getState() {
    try { return window.webapis.avplay.getState() } catch (e) { return 'NONE' }
  },

  setListener(callbacks) {
    try { window.webapis.avplay.setListener(callbacks) } catch (e) { console.error(e) }
  },
}
