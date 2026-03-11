import { useEffect } from 'preact/hooks'

type KeyHandler = (e: KeyboardEvent) => void
type KeyMap = Record<string | number, KeyHandler>

/**
 * Hook for handling TV remote key events on a per-page/component basis.
 */
export function useKeyHandler(keyMap: KeyMap, deps: unknown[] = []): void {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const fn = keyMap[e.key] || keyMap[e.keyCode]
      if (fn) {
        e.preventDefault()
        fn(e)
      }
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, deps)
}
