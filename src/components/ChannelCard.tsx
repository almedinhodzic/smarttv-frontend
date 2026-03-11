import type { Channel } from '@/types'

interface ChannelCardProps {
  channel: Channel
  y: number
}

export function ChannelCard({ channel, y }: ChannelCardProps) {
  return (
    <div
      key={channel.id}
      class="ch-card ch-card-small"
      style={{ transform: `translateY(${y}px)` }}
    >
      <span class="ch-card-num">{channel.num}</span>
      {channel.icon && (
        <img src={channel.icon} alt="" class="ch-card-icon-small" />
      )}
    </div>
  )
}
