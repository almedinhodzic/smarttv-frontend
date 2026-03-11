import { useEffect, useRef, useState } from 'preact/hooks'

const DEBUG = import.meta.env.VITE_DEBUG === 'true'

export function FpsMonitor() {
  const [fps, setFps] = useState(0)
  const framesRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const rafRef = useRef(0)

  useEffect(() => {
    if (!DEBUG) return

    const tick = (now: number) => {
      framesRef.current++
      const delta = now - lastTimeRef.current

      if (delta >= 1000) {
        setFps(Math.round((framesRef.current * 1000) / delta))
        framesRef.current = 0
        lastTimeRef.current = now
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  if (!DEBUG) return null

  const color = fps >= 50 ? '#4ade80' : fps >= 30 ? '#facc15' : '#ef4444'

  return (
    <div
      style={{
        position: 'fixed',
        top: '12px',
        right: '12px',
        background: 'rgba(0,0,0,0.75)',
        color,
        fontFamily: 'monospace',
        fontSize: '18px',
        fontWeight: 'bold',
        padding: '4px 10px',
        borderRadius: '6px',
        zIndex: 99999,
        pointerEvents: 'none',
        lineHeight: '1.4',
      }}
    >
      {fps} FPS
    </div>
  )
}
