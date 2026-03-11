import { useEffect } from 'preact/hooks'
import { focusFirst, setOnBack } from '@/spatial'
import { route } from 'preact-router'

export function EPG() {
  useEffect(() => {
    focusFirst()
    setOnBack(() => route('/'))
  }, [])

  return (
    <div class="page page-epg page-with-sidebar">
      <h1 class="page-title">TV Guide (EPG)</h1>
      <div class="epg-grid">
        <p style={{ color: '#888' }}>EPG grid will be rendered here.</p>
      </div>
    </div>
  )
}
