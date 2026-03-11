import { useState, useEffect, useCallback } from 'preact/hooks'
import { route } from 'preact-router'
import { spatialDisable, spatialEnable } from '@/spatial'

interface SettingsItem {
  key: string
  label: string
}

interface SettingsGroup {
  title: string
  items: SettingsItem[]
}

const GROUPS: SettingsGroup[] = [
  {
    title: 'My settings',
    items: [
      { key: 'manage-channels', label: 'Manage channels' },
      { key: 'subscription', label: 'Subscription overview' },
    ],
  },
  {
    title: 'Manage profiles',
    items: [
      { key: 'switch-profile', label: 'Switch profile' },
      { key: 'edit-profiles', label: 'Edit profiles' },
      { key: 'add-profile', label: 'Add new profile' },
    ],
  },
  {
    title: 'Other',
    items: [
      { key: 'parental-control', label: 'Parental control' },
    ],
  },
  {
    title: 'Device control',
    items: [
      { key: 'about', label: 'About app' },
      { key: 'terms', label: 'Terms of Conduct' },
      { key: 'restart', label: 'Restart app' },
    ],
  },
]

const ALL_ITEMS = GROUPS.flatMap((g) => g.items)

interface SettingsPanelProps {
  open: boolean
  onClose: () => void
}

export function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const [focusIndex, setFocusIndex] = useState(0)

  // Reset focus when opening
  useEffect(() => {
    if (open) {
      setFocusIndex(0)
      spatialDisable()
    } else {
      spatialEnable()
    }
  }, [open])

  const handleSelect = useCallback(() => {
    const item = ALL_ITEMS[focusIndex]
    if (!item) return

    switch (item.key) {
      case 'switch-profile':
        onClose()
        route('/profiles')
        break
      case 'restart':
        window.location.reload()
        break
      // TODO: handle other items
    }
  }, [focusIndex, onClose])

  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          e.stopPropagation()
          setFocusIndex((i) => Math.min(i + 1, ALL_ITEMS.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          e.stopPropagation()
          setFocusIndex((i) => Math.max(i - 1, 0))
          break
        case 'Enter':
        case 'Return':
          e.preventDefault()
          e.stopPropagation()
          handleSelect()
          break
        case 'Escape':
        case 'Back':
        case 'ArrowLeft':
          e.preventDefault()
          e.stopPropagation()
          onClose()
          break
      }
    }

    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [open, focusIndex, handleSelect, onClose])

  let globalIdx = 0

  return (
    <>
      <div class={`settings-overlay ${open ? 'visible' : ''}`} />
      <div class={`settings-panel ${open ? 'open' : ''}`}>
        <h1 class="settings-heading">Settings</h1>

        <div class="settings-scroll">
          {GROUPS.map((group) => (
            <div key={group.title} class="settings-group">
              <h2 class="settings-group-title">{group.title}</h2>
              {group.items.map((item) => {
                const idx = globalIdx++
                const isFocused = idx === focusIndex

                return (
                  <div
                    key={item.key}
                    class={`settings-row ${isFocused ? 'focused' : ''}`}
                  >
                    <span class="settings-row-label">{item.label}</span>
                    <img src="/assets/right-arrow.png" alt="" class="settings-row-arrow" />
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
