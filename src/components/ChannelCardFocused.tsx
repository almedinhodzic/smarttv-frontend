import type { Channel } from '@/types'
import { purchaseBadgeColor, purchaseBadgeLabel, showPurchaseBadge } from '@/utils/purchase'

interface ChannelCardFocusedProps {
  channel: Channel
  y: number
  active: boolean
  isFirst: boolean
  isLast: boolean
}

export function ChannelCardFocused({ channel, y, active, isFirst, isLast }: ChannelCardFocusedProps) {
  return (
    <div
      key={channel.id}
      class={`ch-card ch-card-focused ${active ? 'active' : ''}`}
      style={{ transform: `translateY(${y}px)` }}
    >
      <div
        class="ch-card-accent"
        style={{ background: active ? '#3B82F6' : '#333' }}
      />

      <span class="ch-card-num-big">{channel.num}</span>

      {channel.icon && (
        <img src={channel.icon} alt="" class="ch-card-icon-big" />
      )}

      {channel.hd && (
        <div class="ch-badge ch-badge-hd">HD</div>
      )}

      {showPurchaseBadge(channel) && (
        <div
          class="ch-badge ch-badge-purchase"
          style={{ background: purchaseBadgeColor(channel.purchaseStatus) }}
        >
          {purchaseBadgeLabel(channel.purchaseStatus)}
        </div>
      )}

      <div class="ch-card-name">{channel.name}</div>

      <div class="ch-card-prog">No programme info</div>
      <div class="ch-card-prog-time" />

      <div class="ch-card-nav-hints">
        {!isFirst && (
          <img src="/assets/up-arrow.png" alt="" class="ch-nav-arrow" />
        )}
        {!isLast && (
          <img src="/assets/down-arrow.png" alt="" class="ch-nav-arrow" />
        )}
      </div>
      <img src="/assets/right-arrow.png" alt="" class="ch-nav-arrow-right" />
    </div>
  )
}
