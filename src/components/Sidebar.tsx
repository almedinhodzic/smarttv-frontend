import { useState, useEffect, useCallback } from 'preact/hooks'
import { route } from 'preact-router'
import { useSessionStore } from '@/stores/sessionStore'
import { spatialDisable, spatialEnable } from '@/spatial'

const NAV_ITEMS = [
  { key: 'home', label: 'Home', icon: '/assets/home_icon.png', path: '/' },
  { key: 'livetv', label: 'TV & Radio', icon: '/assets/live_tv_icon.png', path: '/live' },
  { key: 'series', label: 'Series', icon: '/assets/tv_shows_icon.png', path: '/series' },
  { key: 'vod', label: 'VOD', icon: '/assets/vod_icon.png', path: '/vod' },
  { key: 'epg', label: 'TV Guide', icon: '/assets/epg_logo.png', path: '/epg' },
  { key: 'mycontent', label: 'My Content', icon: '/assets/heart_icon.png', path: '/my-content' },
  { key: 'settings', label: 'Settings', icon: '/assets/settings_icon.png', path: '' },
  { key: 'divider', label: '', icon: '', path: '' },
  { key: 'logout', label: 'Logout', icon: '/assets/logout_icon.png', path: '' },
]

interface SidebarProps {
  visible: boolean
  open: boolean
  activePath: string
  onClose: () => void
  onOpenSettings: () => void
}

export function Sidebar({ visible, open, activePath, onClose, onOpenSettings }: SidebarProps) {
  const [focusIndex, setFocusIndex] = useState(0)
  const logout = useSessionStore((s) => s.logout)

  const focusableItems = NAV_ITEMS.filter((item) => item.key !== 'divider')

  const handleSelect = useCallback(async () => {
    const item = focusableItems[focusIndex]
    if (!item) return

    if (item.key === 'logout') {
      await logout()
      route('/auth')
      return
    }

    if (item.key === 'settings') {
      onClose()
      onOpenSettings()
      return
    }

    if (item.path) {
      route(item.path)
      onClose()
    }
  }, [focusIndex, logout, onClose, onOpenSettings])

  // Disable spatial nav while sidebar is open, re-enable on close
  useEffect(() => {
    if (open) {
      spatialDisable()
    } else {
      spatialEnable()
    }
  }, [open])

  // Keyboard nav when sidebar is open
  useEffect(() => {
    if (!visible || !open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        e.stopPropagation()
        setFocusIndex((i) => Math.min(i + 1, focusableItems.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        e.stopPropagation()
        setFocusIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' || e.key === 'Return') {
        e.preventDefault()
        e.stopPropagation()
        handleSelect()
      } else if (e.key === 'ArrowRight' || e.key === 'Escape' || e.key === 'Back') {
        e.preventDefault()
        e.stopPropagation()
        onClose()
      }
    }

    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [visible, open, focusIndex, handleSelect, onClose])

  if (!visible) return null

  let renderIndex = 0

  return (
    <div class={`sidebar ${open ? 'expanded' : ''}`}>
      <nav class="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          if (item.key === 'divider') {
            return <div key="divider" class="sidebar-divider" />
          }

          const idx = renderIndex++
          const isActive = item.path === activePath
          const isFocused = open && focusIndex === idx

          return (
            <div
              key={item.key}
              class={`sidebar-item ${isActive ? 'active' : ''} ${isFocused ? 'focused' : ''}`}
            >
              <img class="sidebar-icon" src={item.icon} alt="" />
              <span class="sidebar-label">{item.label}</span>
            </div>
          )
        })}
      </nav>
    </div>
  )
}
