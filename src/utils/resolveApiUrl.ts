export function resolveApiUrl(path?: string | null): string {
  if (!path) return ''
  const base = import.meta.env.VITE_API_BASE_URL as string
  if (path.startsWith('http')) return path
  return `${base.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`
}
