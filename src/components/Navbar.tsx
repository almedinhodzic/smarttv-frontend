import { useState, useEffect, useCallback } from 'preact/hooks'
import { useSessionStore } from '@/stores/sessionStore'
import { useProfileColorStore } from '@/stores/profileColorStore'
import { Keyboard } from '@/components/Keyboard'
import { spatialDisable, spatialEnable, focusFirst } from '@/spatial'

interface NavbarProps {
  visible: boolean
  hasFocus: boolean
  onBlur: () => void
  onOpenSidebar: () => void
}

function useClock() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const h = now.getHours()
      const m = now.getMinutes()
      const ampm = h >= 12 ? 'PM' : 'AM'
      const h12 = h % 12 || 12
      setTime(`${h12}:${m < 10 ? '0' : ''}${m} ${ampm}`)
    }
    update()
    const id = setInterval(update, 30000)
    return () => clearInterval(id)
  }, [])

  return time
}

// Row 1: mic(0), keyboard(1), messages(2), notifications(3)
// Row 2: profile(4)
const ITEM_COUNT = 5

export function Navbar({ visible, hasFocus, onBlur, onOpenSidebar }: NavbarProps) {
  const [focusIndex, setFocusIndex] = useState(0)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const profile = useSessionStore((s) => s.selectedProfile)
  const getColor = useProfileColorStore((s) => s.getColor)
  const time = useClock()
  const profileColor = profile?.id ? getColor(profile.id) : '#161616'

  const openSearch = useCallback(() => {
    setSearchOpen(true)
    setSearchQuery('')
  }, [])

  const closeSearch = useCallback(() => {
    setSearchOpen(false)
  }, [])

  const handleSearchInput = useCallback((char: string) => {
    setSearchQuery((q) => q + char)
  }, [])

  const handleSearchBackspace = useCallback(() => {
    setSearchQuery((q) => q.slice(0, -1))
  }, [])

  const handleSearchSubmit = useCallback(() => {
    // TODO: perform search with searchQuery
    closeSearch()
  }, [closeSearch])

  // Disable spatial nav when navbar has focus
  useEffect(() => {
    if (hasFocus) {
      spatialDisable()
    } else if (!searchOpen) {
      spatialEnable()
    }
  }, [hasFocus, searchOpen])

  const handleSelect = useCallback(() => {
    switch (focusIndex) {
      case 0: // mic — noop for now
        break
      case 1: // keyboard — open search
        openSearch()
        break
      case 2: // messages — TODO
        break
      case 3: // notifications — TODO
        break
      case 4: // profile — TODO
        break
    }
  }, [focusIndex, openSearch])

  // Navbar internal navigation
  useEffect(() => {
    if (!visible || !hasFocus || searchOpen) return

    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault()
          e.stopPropagation()
          setFocusIndex((i) => Math.min(i + 1, ITEM_COUNT - 1))
          break
        case 'ArrowLeft':
          e.preventDefault()
          e.stopPropagation()
          if (focusIndex === 0) {
            // Leftmost item → open sidebar
            onOpenSidebar()
          } else {
            setFocusIndex((i) => i - 1)
          }
          break
        case 'ArrowDown':
          e.preventDefault()
          e.stopPropagation()
          if (focusIndex >= 2 && focusIndex <= 3) {
            // Right side (messages/notifications) → profile
            setFocusIndex(4)
          } else {
            // Left side (mic/keyboard) or profile → exit to content
            onBlur()
          }
          break
        case 'ArrowUp':
          e.preventDefault()
          e.stopPropagation()
          if (focusIndex === 4) {
            // Row 2 → row 1 (last used position, default to 3)
            setFocusIndex(3)
          }
          // Row 1 up → stay (already at top)
          break
        case 'Enter':
        case 'Return':
          e.preventDefault()
          e.stopPropagation()
          handleSelect()
          break
      }
    }

    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [visible, hasFocus, searchOpen, focusIndex, handleSelect, onBlur, onOpenSidebar])

  // Close search on Back/Escape
  useEffect(() => {
    if (!searchOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Back' || e.key === 'XF86Back') {
        e.preventDefault()
        e.stopPropagation()
        closeSearch()
      }
    }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [searchOpen, closeSearch])

  if (!visible) return null

  const f = hasFocus && !searchOpen

  return (
    <>
      <div class="navbar">
        {/* Row 1 */}
        <div class="navbar-row">
          <div class="navbar-left">
            <div class={`navbar-icon-btn ${f && focusIndex === 0 ? 'focused' : ''}`}>
              <img src="/assets/microphone_icon.png" alt="Voice" class="navbar-icon" />
            </div>
            <div class={`navbar-icon-btn ${f && focusIndex === 1 ? 'focused' : ''}`}>
              <img src="/assets/keyboard.png" alt="Keyboard" class="navbar-icon" />
            </div>
            <span class="navbar-search-label">Search movies, TV, and more...</span>
          </div>
          <div class="navbar-right">
            <div class={`navbar-icon-btn ${f && focusIndex === 2 ? 'focused' : ''}`}>
              <img src="/assets/email.png" alt="Messages" class="navbar-icon" />
            </div>
            <div class={`navbar-icon-btn ${f && focusIndex === 3 ? 'focused' : ''}`}>
              <img src="/assets/bell.png" alt="Notifications" class="navbar-icon" />
            </div>
            <span class="navbar-clock">{time}</span>
          </div>
        </div>

        {/* Row 2 */}
        <div class="navbar-row navbar-row-secondary">
          <div
            class={`navbar-profile ${f && focusIndex === 4 ? 'focused' : ''}`}
            style={{ borderRightColor: profileColor }}
          >
            <img src="/assets/more.png" alt="" class="navbar-profile-icon" />
            <span class="navbar-profile-name">
              {profile?.nickname || profile?.name || 'Profile'}
            </span>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {searchOpen && (
        <div class="search-modal-overlay">
          <div class="search-modal">
            <div class="search-modal-input-row">
              <img src="/assets/search.png" alt="" class="search-modal-icon" />
              <div class="search-modal-input">
                {searchQuery || <span class="search-modal-placeholder">Type to search...</span>}
                <span class="search-modal-cursor" />
              </div>
            </div>
            <Keyboard
              onInput={handleSearchInput}
              onBackspace={handleSearchBackspace}
              onSubmit={handleSearchSubmit}
              visible={true}
            />
            <div class="search-modal-hint">Press Back to close</div>
          </div>
        </div>
      )}
    </>
  )
}
