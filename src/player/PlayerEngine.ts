/**
 * Unified video player abstraction.
 * Uses native AVPlay on Tizen, HTML5 video on webOS/browser.
 * Single instance — reuse across channel switches for performance.
 */

import { detectPlatform, PLATFORM } from '@/platform/detect'
import { tizenPlayer } from '@/platform/tizen'
import type { Platform } from '@/types'

type PlayerEventCallback = (...args: unknown[]) => void

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface HlsInstance {
  destroy: () => void
  loadSource: (url: string) => void
  attachMedia: (el: HTMLVideoElement) => void
  on: (event: string, cb: (...args: unknown[]) => void) => void
}

class PlayerEngine {
  private videoEl: HTMLVideoElement | null = null
  private hlsInstance: HlsInstance | null = null
  private platform: Platform | null = null
  private listeners: Record<string, PlayerEventCallback[]> = {}

  init(videoElement: HTMLVideoElement): void {
    this.platform = detectPlatform()
    this.videoEl = videoElement
  }

  on(event: string, cb: PlayerEventCallback): void {
    if (!this.listeners[event]) this.listeners[event] = []
    this.listeners[event].push(cb)
  }

  off(event: string, cb: PlayerEventCallback): void {
    if (!this.listeners[event]) return
    this.listeners[event] = this.listeners[event].filter((fn) => fn !== cb)
  }

  private emit(event: string, data?: unknown): void {
    if (!this.listeners[event]) return
    this.listeners[event].forEach((fn) => fn(data))
  }

  async play(url: string): Promise<void> {
    if (this.platform === PLATFORM.TIZEN) {
      return this._playTizen(url)
    }
    return this._playHTML5(url)
  }

  private async _playTizen(url: string): Promise<void> {
    try {
      const state = tizenPlayer.getState()
      if (state !== 'NONE' && state !== 'IDLE') {
        tizenPlayer.stop()
        tizenPlayer.close()
      }

      tizenPlayer.open(url)
      tizenPlayer.setListener({
        onbufferingstart: () => this.emit('buffering', true),
        onbufferingcomplete: () => this.emit('buffering', false),
        onstreamcompleted: () => this.emit('ended'),
        onerror: (err: unknown) => this.emit('error', err),
        oncurrentplaytime: (ms: unknown) => this.emit('timeupdate', (ms as number) / 1000),
      })

      await tizenPlayer.prepare()
      tizenPlayer.play()
      this.emit('playing')
    } catch (e) {
      this.emit('error', e)
    }
  }

  private async _playHTML5(url: string): Promise<void> {
    if (!this.videoEl) return

    if (this.hlsInstance) {
      this.hlsInstance.destroy()
      this.hlsInstance = null
    }

    const isHls = url.includes('.m3u8')

    if (isHls && !this.videoEl.canPlayType('application/vnd.apple.mpegurl')) {
      try {
        const { default: Hls } = await import('hls.js') as { default: {
          isSupported: () => boolean
          Events: { ERROR: string }
          new (config: Record<string, unknown>): HlsInstance
        }}
        if (Hls.isSupported()) {
          this.hlsInstance = new Hls({
            maxBufferLength: 10,
            maxMaxBufferLength: 30,
            maxBufferSize: 30 * 1000 * 1000,
          })
          this.hlsInstance.loadSource(url)
          this.hlsInstance.attachMedia(this.videoEl)
          this.hlsInstance.on(Hls.Events.ERROR, (_: unknown, data: { fatal: boolean }) => {
            if (data.fatal) this.emit('error', data)
          })
        }
      } catch (e) {
        this.emit('error', e)
        return
      }
    } else {
      this.videoEl.src = url
    }

    this._attachHTML5Listeners()

    try {
      await this.videoEl.play()
      this.emit('playing')
    } catch (e) {
      this.emit('error', e)
    }
  }

  private _attachHTML5Listeners(): void {
    if (!this.videoEl) return
    this.videoEl.onwaiting = () => this.emit('buffering', true)
    this.videoEl.onplaying = () => this.emit('buffering', false)
    this.videoEl.onended = () => this.emit('ended')
    this.videoEl.onerror = (e) => this.emit('error', e)
    this.videoEl.ontimeupdate = () => this.emit('timeupdate', this.videoEl!.currentTime)
  }

  pause(): void {
    if (this.platform === PLATFORM.TIZEN) {
      tizenPlayer.pause()
    } else if (this.videoEl) {
      this.videoEl.pause()
    }
  }

  resume(): void {
    if (this.platform === PLATFORM.TIZEN) {
      tizenPlayer.play()
    } else if (this.videoEl) {
      this.videoEl.play()
    }
  }

  stop(): void {
    if (this.platform === PLATFORM.TIZEN) {
      tizenPlayer.stop()
      tizenPlayer.close()
    } else {
      if (this.hlsInstance) {
        this.hlsInstance.destroy()
        this.hlsInstance = null
      }
      if (this.videoEl) {
        this.videoEl.pause()
        this.videoEl.removeAttribute('src')
        this.videoEl.load()
      }
    }
    this.emit('stopped')
  }

  setVolume(vol: number): void {
    if (this.videoEl) this.videoEl.volume = vol / 100
  }

  mute(muted: boolean): void {
    if (this.videoEl) this.videoEl.muted = muted
  }

  destroy(): void {
    this.stop()
    this.listeners = {}
    this.videoEl = null
  }
}

// Singleton — one player instance for the entire app
export const playerEngine = new PlayerEngine()
