import { useState, useEffect, useCallback } from 'preact/hooks'

// 50 keys per layout, 10 per row, 5 rows
// Row 4 (bottom): [modeSwitch, SPACE, SPACE, SPACE, @, -, _, /, ?, OK]
const LOWER_KEYS = [
  '1','2','3','4','5','6','7','8','9','0',
  'q','w','e','r','t','y','u','i','o','p',
  'a','s','d','f','g','h','j','k','l','⌫',
  '⇧','z','x','c','v','b','n','m',',','.',
  '#+=','SPACE','SPACE','SPACE','@','-','_','/','?','OK',
]

const UPPER_KEYS = [
  '!','@','#','$','%','^','&','*','(',')',
  'Q','W','E','R','T','Y','U','I','O','P',
  'A','S','D','F','G','H','J','K','L','⌫',
  '⇧','Z','X','C','V','B','N','M','?','!',
  '#+=','SPACE','SPACE','SPACE','@','-','_','/',':','OK',
]

const SPECIAL_KEYS = [
  '1','2','3','4','5','6','7','8','9','0',
  '!','@','#','$','%','^','&','*','(',')',
  '-','_','=','+','[',']','{','}','|','⌫',
  '\\','/',':',';','"',"'",'<','>','~','`',
  'ABC','SPACE','SPACE','SPACE',',','.','?','!','@','OK',
]

type KeyboardMode = 'lower' | 'upper' | 'special'
const COLS = 10

interface KeyboardProps {
  onInput: (char: string) => void
  onBackspace: () => void
  onSubmit: () => void
  visible?: boolean
}

export function Keyboard({ onInput, onBackspace, onSubmit, visible = true }: KeyboardProps) {
  const [mode, setMode] = useState<KeyboardMode>('lower')
  const [focusIndex, setFocusIndex] = useState(0)

  const keys = mode === 'upper' ? UPPER_KEYS : mode === 'special' ? SPECIAL_KEYS : LOWER_KEYS

  const handleKeyPress = useCallback(() => {
    const idx = focusIndex
    const key = keys[idx]
    if (!key) return

    // Space bar (indices 41, 42, 43 map to the SPACE slots)
    if (key === 'SPACE') {
      onInput(' ')
      return
    }
    if (key === '⌫') {
      onBackspace()
      return
    }
    if (key === 'OK') {
      onSubmit()
      return
    }
    if (key === '⇧') {
      setMode((m) => m === 'upper' ? 'lower' : 'upper')
      return
    }
    if (key === '#+=') {
      setMode('special')
      return
    }
    if (key === 'ABC') {
      setMode('lower')
      return
    }

    onInput(key)

    // Auto-lowercase after typing an uppercase letter
    if (mode === 'upper' && /^[A-Z]$/.test(key)) {
      setMode('lower')
    }
  }, [focusIndex, keys, mode, onInput, onBackspace, onSubmit])

  // Navigation
  const moveLeft = useCallback(() => {
    setFocusIndex((i) => {
      // Bottom row special nav
      if (i >= 40) {
        if (i === 40) return 49 // wrap
        if (i >= 41 && i <= 43) return 40 // space → mode switch
        if (i === 44) return 41 // after space → space
        return i - 1
      }
      // Wrap within row
      return i % COLS === 0 ? i + 9 : i - 1
    })
  }, [])

  const moveRight = useCallback(() => {
    setFocusIndex((i) => {
      if (i >= 40) {
        if (i === 49) return 40
        if (i === 40) return 41 // mode switch → space
        if (i >= 41 && i <= 43) return 44 // space → first key after space
        return i + 1
      }
      return i % COLS === 9 ? i - 9 : i + 1
    })
  }, [])

  const moveUp = useCallback(() => {
    setFocusIndex((i) => {
      if (i >= 40) {
        // Bottom row → row 3
        if (i === 40) return 30
        if (i >= 41 && i <= 43) return 32
        if (i === 44) return 34
        if (i === 45) return 35
        if (i === 46) return 36
        if (i === 47) return 37
        if (i === 48) return 38
        return 39
      }
      return i >= COLS ? i - COLS : i
    })
  }, [])

  const moveDown = useCallback(() => {
    setFocusIndex((i) => {
      if (i >= 30 && i < 40) {
        // Row 3 → bottom row
        if (i === 30) return 40
        if (i <= 33) return 41
        if (i === 34) return 44
        if (i === 35) return 45
        if (i === 36) return 46
        if (i === 37) return 47
        if (i === 38) return 48
        return 49
      }
      return i < 30 ? i + COLS : i
    })
  }, [])

  useEffect(() => {
    if (!visible) return

    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':  e.preventDefault(); moveLeft(); break
        case 'ArrowRight': e.preventDefault(); moveRight(); break
        case 'ArrowUp':    e.preventDefault(); moveUp(); break
        case 'ArrowDown':  e.preventDefault(); moveDown(); break
        case 'Enter':
        case 'Return':
          e.preventDefault()
          handleKeyPress()
          break
        case 'Backspace':
          e.preventDefault()
          onBackspace()
          break
        case 'Shift':
          e.preventDefault()
          setMode((m) => m === 'upper' ? 'lower' : 'upper')
          break
        default:
          // Direct char input from physical/remote keyboard
          if (e.key.length === 1) {
            e.preventDefault()
            onInput(e.key)
            // Auto-lowercase after uppercase
            if (mode === 'upper' && /^[A-Z]$/.test(e.key)) {
              setMode('lower')
            }
          }
      }
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [visible, moveLeft, moveRight, moveUp, moveDown, handleKeyPress, onBackspace, onInput, mode])

  if (!visible) return null

  // Render rows 0-3 (standard 10-key rows)
  const standardRows = []
  for (let row = 0; row < 4; row++) {
    const rowKeys = []
    for (let col = 0; col < COLS; col++) {
      const idx = row * COLS + col
      const key = keys[idx]
      const isFocused = idx === focusIndex
      const isAction = key === '⌫' || key === '⇧'
      const isShiftActive = key === '⇧' && mode === 'upper'

      rowKeys.push(
        <div
          key={`${row}-${col}`}
          class={`key ${isFocused ? 'focused' : ''} ${isAction ? 'key-action' : ''} ${isShiftActive ? 'key-active' : ''}`}
        >
          {key === '⇧' && mode === 'upper' ? '⬆' : key}
        </div>
      )
    }
    standardRows.push(
      <div key={row} class="keyboard-row">{rowKeys}</div>
    )
  }

  // Render row 4 (bottom — special layout with space bar)
  const isSpaceFocused = focusIndex >= 41 && focusIndex <= 43
  const bottomRow = (
    <div class="keyboard-row">
      {/* Mode switch */}
      <div class={`key key-action ${focusIndex === 40 ? 'focused' : ''}`}>
        {keys[40]}
      </div>
      {/* Space bar (3-wide) */}
      <div
        class={`key key-space ${isSpaceFocused ? 'focused' : ''}`}
        style={{ width: '220px' }}
      >
        SPACE
      </div>
      {/* Remaining keys: @, -, _, /, ?, OK */}
      {[44, 45, 46, 47, 48].map((idx) => (
        <div
          key={idx}
          class={`key ${focusIndex === idx ? 'focused' : ''}`}
        >
          {keys[idx]}
        </div>
      ))}
      {/* OK button */}
      <div class={`key key-action key-submit ${focusIndex === 49 ? 'focused' : ''}`}>
        OK
      </div>
    </div>
  )

  return (
    <div class="auth-keyboard">
      <div class="keyboard-mode-label text-muted" style={{ fontSize: '16px', marginBottom: '8px', textAlign: 'center' }}>
        {mode === 'lower' ? 'abc' : mode === 'upper' ? 'ABC' : '#+='}
      </div>
      {standardRows}
      {bottomRow}
    </div>
  )
}
