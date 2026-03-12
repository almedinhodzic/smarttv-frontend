import { useState, useEffect } from 'preact/hooks'
import { useSessionStore } from '@/stores/sessionStore'

interface ApiImageProps {
  src: string
  alt?: string
  class?: string
}

const cache = new Map<string, string>()
const failed = new Set<string>()

export function ApiImage({ src, alt = '', ...props }: ApiImageProps) {
  const token = useSessionStore((s) => s.token)
  const [blobUrl, setBlobUrl] = useState<string>(cache.get(src) || '')

  useEffect(() => {
    if (!src || failed.has(src)) return
    if (cache.has(src)) {
      setBlobUrl(cache.get(src)!)
      return
    }

    let cancelled = false
    const headers: Record<string, string> = {
      Accept: 'application/vnd.beenius+json',
    }
    if (token) {
      headers['Authorization'] = 'Bearer ' + token
    }

    fetch(src, { headers })
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status))
        return res.blob()
      })
      .then((blob) => {
        if (cancelled) return
        const url = URL.createObjectURL(blob)
        cache.set(src, url)
        setBlobUrl(url)
      })
      .catch(() => { failed.add(src) })

    return () => { cancelled = true }
  }, [src, token])

  if (!blobUrl) return null
  return <img src={blobUrl} alt={alt} class={props.class} />
}
