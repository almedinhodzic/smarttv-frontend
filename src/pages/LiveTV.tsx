import { useEffect, useRef } from 'preact/hooks'
import { useChannelStore } from '@/stores/channelStore'
import { usePlayerStore } from '@/stores/playerStore'
import { playerEngine } from '@/player/PlayerEngine'
import { setOnBack } from '@/spatial'
import { route } from 'preact-router'

export function LiveTV() {
  const videoRef = useRef(null)
  const currentChannel = useChannelStore((s) => s.currentChannel)
  const nextChannel = useChannelStore((s) => s.nextChannel)
  const prevChannel = useChannelStore((s) => s.prevChannel)
  const setPlaying = usePlayerStore((s) => s.setPlaying)
  const setBuffering = usePlayerStore((s) => s.setBuffering)

  useEffect(() => {
    if (videoRef.current) {
      playerEngine.init(videoRef.current)
      playerEngine.on('playing', () => setPlaying(true))
      playerEngine.on('buffering', (b) => setBuffering(b))
    }

    setOnBack(() => route('/'))

    return () => {
      playerEngine.stop()
    }
  }, [])

  useEffect(() => {
    if (currentChannel?.url) {
      playerEngine.play(currentChannel.url)
    }
  }, [currentChannel])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ChannelUp' || e.key === 'ArrowUp') {
        e.preventDefault()
        nextChannel()
      } else if (e.key === 'ChannelDown' || e.key === 'ArrowDown') {
        e.preventDefault()
        prevChannel()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [nextChannel, prevChannel])

  return (
    <div class="page page-livetv">
      <video
        ref={videoRef}
        class="player-video"
        playsinline
        autoplay
      />
      {currentChannel && (
        <div class="channel-info-overlay">
          <span class="channel-number">{currentChannel.num}</span>
          <span class="channel-name">{currentChannel.name}</span>
        </div>
      )}
    </div>
  )
}
