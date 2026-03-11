interface EpgCardProps {
  index: number
  focused: boolean
  title: string
  time: string
  showProgress?: boolean
}

export function EpgCard({ index, focused, title, time, showProgress }: EpgCardProps) {
  return (
    <div
      class={`epg-card ${focused ? 'epg-card-focused' : ''}`}
      style={{ left: `${index * 315}px` }}
    >
      <div class="epg-card-image" />

      <div class="epg-card-info">
        <span class="epg-card-title">{title}</span>

        {showProgress && (
          <>
            <span class="epg-card-countdown" />
            <div class="epg-card-progress-track">
              <div class="epg-card-progress-fill" style={{ width: '0%' }} />
            </div>
          </>
        )}

        {!showProgress && time && (
          <span class="epg-card-time">{time}</span>
        )}
      </div>

      {focused && <div class="epg-card-ring" />}
    </div>
  )
}
