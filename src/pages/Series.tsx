import { useEffect } from 'preact/hooks'
import { focusFirst, setOnBack } from '@/spatial'
import { route } from 'preact-router'

export function Series() {
  useEffect(() => {
    focusFirst()
    setOnBack(() => route('/'))
  }, [])

  return (
    <div class="page page-series page-with-sidebar">
      <h1 class="page-title">Series</h1>
      <div class="content-grid">
        <p style={{ color: '#888' }}>Series catalog will be loaded here.</p>
      </div>
    </div>
  )
}
