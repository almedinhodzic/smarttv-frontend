import type { Category } from '@/services/sdk/src/models/vod'
import { formatCategoryLabel } from '@/utils/formatCategoryLabel'

interface VodCategoryBarProps {
  categories: Category[]
  selectedIndex: number
  focused: boolean
  scrollOffset: number
}

export function VodCategoryBar({ categories, selectedIndex, focused, scrollOffset }: VodCategoryBarProps) {
  return (
    <div class="vod-category-bar">
      <div
        class="vod-category-scroll"
        style={{ transform: `translateX(${scrollOffset}px)` }}
      >
        {categories.map((cat, i) => {
          const isSelected = i === selectedIndex
          const isFocused = focused && isSelected

          return (
            <div
              key={cat.id}
              class={`vod-category-chip ${isSelected ? 'selected' : ''} ${isFocused ? 'focused' : ''}`}
            >
              <span class="vod-category-chip-label">{formatCategoryLabel(cat.title)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
