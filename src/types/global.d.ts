// Tizen global APIs
interface Window {
  tizen: {
    application: {
      getCurrentApplication: () => { exit: () => void }
    }
    systeminfo: {
      getCapability: (key: string) => string
    }
    tvinputdevice: {
      registerKey: (key: string) => void
    }
  }
  webapis: {
    productinfo: {
      getDuid: () => string
    }
    avplay: {
      open: (url: string) => void
      prepareAsync: (onSuccess: () => void, onError: (e: unknown) => void) => void
      play: () => void
      stop: () => void
      pause: () => void
      close: () => void
      getState: () => string
      setDisplayRect: (x: number, y: number, w: number, h: number) => void
      setDisplayMethod: (method: string) => void
      setListener: (callbacks: Record<string, (...args: unknown[]) => void>) => void
    }
  }
  // webOS global APIs
  webOS: {
    platformBack: () => void
    deviceInfo: (cb: (info: Record<string, unknown>) => void) => void
    service: {
      request: (uri: string, params: Record<string, unknown>) => void
    }
  }
  webOSSystem: unknown
}

// CSS module declarations
declare module '*.css' {
  const content: Record<string, string>
  export default content
}
