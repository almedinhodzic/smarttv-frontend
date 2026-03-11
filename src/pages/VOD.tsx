import { useEffect } from 'preact/hooks'
import { focusFirst, setOnBack } from '@/spatial'
import { route } from 'preact-router'

export function VOD() {
  useEffect(() => {
    focusFirst()
    setOnBack(() => route('/'))
  }, [])

  return (
    <div class="page page-vod page-with-sidebar">
      <h1 class="page-title">Movies / VOD</h1>
      <div class="content-grid">
        <p style={{ color: '#888' }}>VOD catalog will be loaded here.</p>
      </div>
    </div>
  )
}
