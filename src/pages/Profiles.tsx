import { useState, useEffect, useCallback } from 'preact/hooks'
import { route } from 'preact-router'
import { sdk } from '@/services/sdkInstance'
import { useSessionStore } from '@/stores/sessionStore'
import { useProfileColorStore, DEFAULT_COLOR } from '@/stores/profileColorStore'
import { Loader } from '@/components/Loader'
import { spatialDisable, spatialEnable } from '@/spatial'

interface UserProfile {
  id: string
  idProfile: number
  name: string
  nickname?: string
  ageRating?: number
  language?: string
  isDefault?: boolean
  avatarResourceLink?: string
  pinValidTill?: number
  status?: string
  authPin?: string | null
}

const COLS = 5

export function Profiles() {
  const [profiles, setProfiles] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [focusIndex, setFocusIndex] = useState(0)

  // PIN entry state
  const [showPin, setShowPin] = useState(false)
  const [profilePin, setProfilePin] = useState('')
  const [pinLoading, setPinLoading] = useState(false)
  const [pinError, setPinError] = useState('')

  const user = useSessionStore((s) => s.user)
  const selectedProfile = useSessionStore((s) => s.selectedProfile)
  const selectProfile = useSessionStore((s) => s.selectProfile)
  const getColor = useProfileColorStore((s) => s.getColor)

  useEffect(() => {
    spatialDisable()
    return () => spatialEnable()
  }, [])

  // Load profiles
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const regionId = user?.regionIds?.[0]
        const subscriberId = user?.userId
        if (!regionId || !subscriberId) {
          setError('Session expired. Please sign in again.')
          return
        }

        const res = await sdk.user.getUserProfiles(regionId, subscriberId)
        const list = Array.isArray(res) ? res : ((res as Record<string, unknown>)?.list as UserProfile[] ?? [])
        const active = (list as UserProfile[]).filter((p) => p.status === 'ACTIVE' || !p.status)
        setProfiles(active)

        const defaultIdx = active.findIndex((p) => p.isDefault)
        setFocusIndex(defaultIdx >= 0 ? defaultIdx : 0)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load profiles')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  // Total items = profiles + 1 (add button)
  const totalItems = profiles.length + 1
  const isAddButton = (idx: number) => idx === profiles.length

  const applyProfile = useCallback((p: UserProfile) => {
    selectProfile({
      id: p.id,
      idProfile: p.idProfile,
      name: p.name,
      nickname: p.nickname,
      ageRating: p.ageRating,
      language: p.language,
      isDefault: p.isDefault,
      avatarResourceLink: p.avatarResourceLink,
      pinValidTill: p.pinValidTill,
    })
    route('/')
  }, [selectProfile])

  const selectFocused = useCallback(() => {
    if (isAddButton(focusIndex)) {
      // TODO: navigate to create profile
      return
    }

    const p = profiles[focusIndex]
    if (!p) return

    if (p.authPin && p.authPin !== 'null') {
      setShowPin(true)
      setProfilePin('')
      setPinError('')
      return
    }

    applyProfile(p)
  }, [profiles, focusIndex, applyProfile])

  const submitPin = useCallback(async () => {
    if (pinLoading || profilePin.length !== 4) return

    try {
      setPinLoading(true)
      setPinError('')
      const p = profiles[focusIndex]
      if (!p) return
      await sdk.user.validateProfilePin(p.idProfile, profilePin)
      setShowPin(false)
      applyProfile(p)
    } catch (_e) {
      setPinError('Incorrect PIN. Please try again.')
      setProfilePin('')
    } finally {
      setPinLoading(false)
    }
  }, [profiles, focusIndex, profilePin, pinLoading, applyProfile])

  // Key handling
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (showPin) {
        if (e.key === 'Escape' || e.key === 'Back') {
          e.preventDefault()
          setShowPin(false)
          setProfilePin('')
          return
        }
        if (e.key === 'Backspace') {
          e.preventDefault()
          setProfilePin((p) => p.slice(0, -1))
          setPinError('')
          return
        }
        if (e.key === 'Enter' && profilePin.length === 4) {
          e.preventDefault()
          submitPin()
          return
        }
        if (/^[0-9]$/.test(e.key) && profilePin.length < 4) {
          e.preventDefault()
          setProfilePin((p) => p + e.key)
          setPinError('')
          return
        }
        return
      }

      // Profile grid navigation
      if (!totalItems) return

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          setFocusIndex((i) => Math.max(0, i - 1))
          break
        case 'ArrowRight':
          e.preventDefault()
          setFocusIndex((i) => Math.min(totalItems - 1, i + 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setFocusIndex((i) => {
            const next = i - COLS
            return next >= 0 ? next : i
          })
          break
        case 'ArrowDown':
          e.preventDefault()
          setFocusIndex((i) => {
            const next = i + COLS
            return next < totalItems ? next : i
          })
          break
        case 'Enter':
        case 'Return':
          e.preventDefault()
          selectFocused()
          break
        case 'Escape':
        case 'Back':
          e.preventDefault()
          route('/auth')
          break
      }
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [totalItems, showPin, profilePin, selectFocused, submitPin])

  return (
    <div class="page page-profiles">
      <h1 class="profiles-title">Profile selection</h1>
      <p class="profiles-subtitle">Choose profile or create new</p>

      {loading && <Loader message="Loading profiles..." />}
      {error && <p class="text-error" style={{ fontSize: '28px' }}>{error}</p>}

      {!loading && !error && (
        <div class="profiles-grid">
          {profiles.map((p, i) => {
            const color = getColor(p.id)
            const isCurrent = selectedProfile?.id === p.id
            const isFocused = i === focusIndex

            return (
              <div
                key={p.id}
                class={`profile-card ${isFocused ? 'focused' : ''}`}
              >
                <div
                  class="profile-color-box"
                  style={{ background: color }}
                >
                  <span class="profile-color-box-name">
                    {(p.nickname || p.name || '?').substring(0, 2).toUpperCase()}
                  </span>
                  {isCurrent && (
                    <img src="/assets/check-box.png" alt="" class="profile-check-icon" />
                  )}
                  {p.authPin && p.authPin !== 'null' && (
                    <div class="profile-lock">L</div>
                  )}
                </div>
                <span class="profile-name">{p.nickname || p.name}</span>
              </div>
            )
          })}

          {/* Add new profile button */}
          <div
            class={`profile-card ${focusIndex === profiles.length ? 'focused' : ''}`}
          >
            <div
              class="profile-color-box profile-color-box-add"
              style={{ background: DEFAULT_COLOR }}
            >
              <img src="/assets/add.png" alt="Add" class="profile-add-icon" />
            </div>
            <span class="profile-name">Add</span>
          </div>
        </div>
      )}

      {/* PIN Modal */}
      {showPin && (
        <div class="pin-modal-overlay">
          <div class="pin-modal">
            <h2 class="pin-modal-title">Profile Lock</h2>
            <p class="pin-modal-subtitle">
              Enter PIN for {profiles[focusIndex]?.nickname || profiles[focusIndex]?.name}
            </p>

            <div class="pin-slots">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  class={`pin-slot ${i === profilePin.length ? 'active' : ''} ${i < profilePin.length ? 'filled' : ''} ${pinError ? 'error' : ''}`}
                >
                  {i < profilePin.length ? '*' : ''}
                </div>
              ))}
            </div>

            {pinError && <span class="text-error" style={{ fontSize: '18px' }}>{pinError}</span>}
            {pinLoading && <Loader />}
            {!pinError && !pinLoading && (
              <span class="text-muted" style={{ fontSize: '16px' }}>
                {profilePin.length === 4 ? 'Press OK' : 'Enter 4-digit PIN'}
              </span>
            )}

            <p class="pin-modal-help">Press BACK to cancel</p>
          </div>
        </div>
      )}
    </div>
  )
}
