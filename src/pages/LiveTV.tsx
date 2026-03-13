import { useEffect, useState, useCallback } from 'preact/hooks'
import { route } from 'preact-router'
import { useChannelStore } from '@/stores/channelStore'
import { useSessionStore } from '@/stores/sessionStore'
import { isSpatialEnabled } from '@/spatial'
import { Loader } from '@/components/Loader'
import { ChannelCard } from '@/components/ChannelCard'
import { ChannelCardFocused } from '@/components/ChannelCardFocused'
import { EpgCard } from '@/components/EpgCard'

const CARD_H = 72
const CARD_H_BIG = 360
const GAP = 8
const LIST_H = 940
const CENTER_Y = Math.round(LIST_H / 2 - CARD_H_BIG / 2)

export function LiveTV(_props: { path?: string }) {
  const channels = useChannelStore((s) => s.channels)
  const isLoading = useChannelStore((s) => s.isLoading)
  const error = useChannelStore((s) => s.error)
  const fetchChannels = useChannelStore((s) => s.fetchChannels)
  const user = useSessionStore((s) => s.user)
  const selectedProfile = useSessionStore((s) => s.selectedProfile)

  const [focusIndex, setFocusIndex] = useState(0)
  const [focusArea, setFocusArea] = useState<'list' | 'epg'>('list')
  const [epgFocusIndex, setEpgFocusIndex] = useState(0)

  // Spatial nav stays active so edge detection triggers sidebar on ArrowLeft

  useEffect(() => {
    const regionId = user?.regionIds?.[0]
    if (!regionId) return
    const lang = selectedProfile?.language || 'en'
    fetchChannels(regionId, user?.userId, lang)
  }, [user, selectedProfile, fetchChannels])

  useEffect(() => {
    if (channels.length > 0) {
      setFocusIndex(channels.length - 1)
    }
  }, [channels.length])

  const scrollY = CENTER_Y - focusIndex * (CARD_H + GAP)
  const listActive = focusArea === 'list'

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (!channels.length || !isSpatialEnabled()) return

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        e.stopPropagation()
        if (focusArea === 'list') {
          setFocusIndex((i) => (i > 0 ? i - 1 : channels.length - 1))
        } else {
          setFocusArea('list')
          setEpgFocusIndex(0)
        }
        break

      case 'ArrowDown':
        e.preventDefault()
        e.stopPropagation()
        if (focusArea === 'list') {
          setFocusIndex((i) => (i < channels.length - 1 ? i + 1 : 0))
        } else {
          setFocusArea('list')
          setEpgFocusIndex(0)
        }
        break

      case 'ArrowRight':
        e.preventDefault()
        e.stopPropagation()
        if (focusArea === 'list') {
          setFocusArea('epg')
          setEpgFocusIndex(0)
        } else if (focusArea === 'epg') {
          setEpgFocusIndex((i) => Math.min(i + 1, 2))
        }
        break

      case 'ArrowLeft':
        if (focusArea === 'epg') {
          e.preventDefault()
          e.stopPropagation()
          if (epgFocusIndex > 0) {
            setEpgFocusIndex((i) => i - 1)
          } else {
            setFocusArea('list')
          }
        }
        // Left from list → let spatial nav edge callback open sidebar
        break

      case 'Enter':
      case 'Return':
        e.preventDefault()
        e.stopPropagation()
        if (focusArea === 'list') {
          const ch = channels[focusIndex]
          if (ch) {
            route(`/player?channelId=${ch.id}&type=live`)
          }
        }
        break

      case 'Escape':
      case 'Back':
        e.preventDefault()
        e.stopPropagation()
        if (focusArea === 'epg') {
          setFocusArea('list')
          setEpgFocusIndex(0)
        } else {
          route('/')
        }
        break
    }
  }, [channels, focusIndex, focusArea, epgFocusIndex])

  useEffect(() => {
    document.addEventListener('keydown', handleKey, true)
    return () => document.removeEventListener('keydown', handleKey, true)
  }, [handleKey])

  return (
    <div class="page page-livetv">
      {isLoading && <Loader message="Loading channels..." />}
      {error && <p class="text-error" style={{ fontSize: '28px', padding: '60px' }}>{error}</p>}

      {!isLoading && !error && channels.length > 0 && (
        <>
          <div class="livetv-title">TV & Radio</div>

          <div class="channel-list">
            <div
              class="channel-list-scroll"
              style={{ transform: `translateY(${scrollY}px)` }}
            >
              {channels.map((ch, idx) => {
                if (idx !== focusIndex) {
                  const y = idx > focusIndex
                    ? idx * (CARD_H + GAP) + (CARD_H_BIG - CARD_H)
                    : idx * (CARD_H + GAP)
                  return <ChannelCard key={ch.id} channel={ch} y={y} />
                }

                return (
                  <ChannelCardFocused
                    key={ch.id}
                    channel={ch}
                    y={idx * (CARD_H + GAP)}
                    active={listActive}
                    isFirst={idx === 0}
                    isLast={idx === channels.length - 1}
                  />
                )
              })}
            </div>
          </div>

          <div class="epg-cards" style={{ top: `${90 + CENTER_Y + 36}px` }}>
            <div class="epg-labels">
              <div class="epg-label-group">
                <span class="epg-label epg-label-live">LIVE</span>
                <span class="epg-label-time">--:-- – --:--</span>
              </div>
              <div class="epg-label-group">
                <span class="epg-label epg-label-next">NEXT</span>
                <span class="epg-label-time">--:--</span>
              </div>
              <div class="epg-label-group">
                <span class="epg-label epg-label-later">LATER</span>
                <span class="epg-label-time">--:--</span>
              </div>
            </div>

            <EpgCard index={0} focused={focusArea === 'epg' && epgFocusIndex === 0} title="No programme info" time="" showProgress />
            <EpgCard index={1} focused={focusArea === 'epg' && epgFocusIndex === 1} title="No programme info" time="" />
            <EpgCard index={2} focused={focusArea === 'epg' && epgFocusIndex === 2} title="No programme info" time="" />
          </div>
        </>
      )}
    </div>
  )
}
