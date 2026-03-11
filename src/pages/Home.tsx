import { useEffect } from 'preact/hooks'
import { focusFirst } from '@/spatial'
import { useSessionStore } from '@/stores/sessionStore'

export function Home() {
  const profile = useSessionStore((s) => s.selectedProfile)

  useEffect(() => { focusFirst() }, [])

  return (
    <div class="page page-home page-with-sidebar">
      <h1 class="page-title">
        Welcome{profile?.nickname ? `, ${profile.nickname}` : profile?.name ? `, ${profile.name}` : ''}
      </h1>
      <div class="home-rows">
        <section class="home-row">
          <h2 class="row-title">Continue Watching</h2>
          <div class="row-scroll">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} class="card" data-focusable>
                <div class="card-poster" />
                <span class="card-label">Item {i}</span>
              </div>
            ))}
          </div>
        </section>
        <section class="home-row">
          <h2 class="row-title">Live Channels</h2>
          <div class="row-scroll">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} class="card" data-focusable>
                <div class="card-poster" />
                <span class="card-label">Channel {i}</span>
              </div>
            ))}
          </div>
        </section>
        <section class="home-row">
          <h2 class="row-title">Popular Movies</h2>
          <div class="row-scroll">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} class="card" data-focusable>
                <div class="card-poster" />
                <span class="card-label">Movie {i}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
