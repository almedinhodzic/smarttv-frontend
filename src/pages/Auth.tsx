import { useState, useEffect, useCallback } from 'preact/hooks'
import { route } from 'preact-router'
import { sdk } from '@/services/sdkInstance'
import { useSessionStore } from '@/stores/sessionStore'
import { Loader } from '@/components/Loader'
import { Keyboard } from '@/components/Keyboard'
import { spatialDisable, spatialEnable } from '@/spatial'

const PIN_LENGTH = 10

export function Auth() {
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const login = useSessionStore((s) => s.login)

  // Disable spatial nav — Keyboard handles its own key events
  useEffect(() => {
    spatialDisable()
    return () => spatialEnable()
  }, [])

  const appendChar = useCallback((ch: string) => {
    setPin((p) => {
      if (p.length >= PIN_LENGTH) return p
      return p + ch
    })
    setError('')
  }, [])

  const backspace = useCallback(() => {
    setPin((p) => p.slice(0, -1))
    setError('')
  }, [])

  const submit = useCallback(async () => {
    if (loading || pin.length !== PIN_LENGTH) return

    try {
      setLoading(true)
      setError('')

      const res = await sdk.auth.authenticateAuthPin({
        authPin: pin,
        deviceName: 'Smart TV',
        deviceId: '6c1eb17d-3250-4718-989a-f8acab955455',
        deviceType: 'WEB_BROWSER_CAPABLE_DEVICE',
      })

      login(res.access_token, res.refresh_token)
      setPin('')
      route('/profiles')
    } catch (_e) {
      setError('Invalid PIN. Please check and try again.')
      setPin('')
    } finally {
      setLoading(false)
    }
  }, [pin, loading, login])

  const pinSlots = []
  for (let i = 0; i < PIN_LENGTH; i++) {
    const filled = i < pin.length
    const active = i === pin.length
    const slotClass = `pin-slot ${active ? 'active' : ''} ${filled ? 'filled' : ''} ${error ? 'error' : ''}`
    pinSlots.push(
      <div key={i} class={slotClass}>
        {filled ? '*' : ''}
      </div>
    )
  }

  return (
    <div class="page page-auth">
      <img class="auth-logo" src="/assets/logo.png" alt="" />
      <h1 class="auth-title">Sign In with PIN</h1>
      <p class="auth-subtitle">
        {loading ? 'Checking...' : 'Enter your 10-character Auth PIN to log in'}
      </p>

      <div class="pin-slots">{pinSlots}</div>

      <div class="auth-status">
        {error && <span class="text-error">{error}</span>}
        {loading && <Loader message="Verifying..." />}
        {!error && !loading && pin.length === PIN_LENGTH && (
          <span style={{ color: 'var(--color-primary-hover)' }}>Press OK to continue</span>
        )}
        {!error && !loading && pin.length < PIN_LENGTH && (
          <span class="text-muted">Entered {pin.length} of {PIN_LENGTH}</span>
        )}
      </div>

      <Keyboard
        onInput={appendChar}
        onBackspace={backspace}
        onSubmit={submit}
        visible={!loading}
      />

      <p class="auth-help">PIN is provided by your administrator or mobile app.</p>
    </div>
  )
}
