/**
 * Lightweight spatial navigation engine for TV remote control.
 * ~2KB — no dependencies. Handles directional focus management.
 */

type Direction = 'up' | 'down' | 'left' | 'right'

const DIRECTION_MAP: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
}

const KEY_ENTER = ['Enter', 'Return']
const KEY_BACK = ['Escape', 'Back', 'XF86Back', '10009']

let currentFocused: HTMLElement | null = null
let onBackCallback: (() => void) | null = null
let onEdgeCallback: ((direction: Direction) => void) | null = null
let enabled = true

function getAllFocusable(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-focusable]:not([disabled]):not([data-focus-hidden])'))
}

interface Rect {
  x: number; y: number
  left: number; right: number; top: number; bottom: number
  width: number; height: number
}

function getRect(el: HTMLElement): Rect {
  const r = el.getBoundingClientRect()
  return {
    x: r.left + r.width / 2,
    y: r.top + r.height / 2,
    left: r.left, right: r.right, top: r.top, bottom: r.bottom,
    width: r.width, height: r.height,
  }
}

function findClosest(current: HTMLElement, direction: Direction): HTMLElement | null {
  const elements = getAllFocusable()
  if (!elements.length) return null

  const currentRect = getRect(current)
  let bestEl: HTMLElement | null = null
  let bestDist = Infinity

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i]
    if (el === current) continue

    const rect = getRect(el)
    let isCandidate = false
    let dist = 0

    switch (direction) {
      case 'up':
        isCandidate = rect.bottom <= currentRect.top + 2
        dist = Math.abs(currentRect.y - rect.y) + Math.abs(currentRect.x - rect.x) * 0.5
        break
      case 'down':
        isCandidate = rect.top >= currentRect.bottom - 2
        dist = Math.abs(currentRect.y - rect.y) + Math.abs(currentRect.x - rect.x) * 0.5
        break
      case 'left':
        isCandidate = rect.right <= currentRect.left + 2
        dist = Math.abs(currentRect.x - rect.x) + Math.abs(currentRect.y - rect.y) * 0.5
        break
      case 'right':
        isCandidate = rect.left >= currentRect.right - 2
        dist = Math.abs(currentRect.x - rect.x) + Math.abs(currentRect.y - rect.y) * 0.5
        break
    }

    if (isCandidate && dist < bestDist) {
      bestDist = dist
      bestEl = el
    }
  }

  return bestEl
}

function setFocus(el: HTMLElement): void {
  if (!el) return

  if (currentFocused) {
    currentFocused.classList.remove('focused')
    currentFocused.dispatchEvent(new CustomEvent('focusout', { bubbles: true }))
  }

  currentFocused = el
  currentFocused.classList.add('focused')
  currentFocused.dispatchEvent(new CustomEvent('focusin', { bubbles: true }))

  el.scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
}

function handleKeyDown(e: KeyboardEvent): void {
  if (!enabled) return

  const direction = DIRECTION_MAP[e.key]

  if (direction) {
    e.preventDefault()
    if (!currentFocused) {
      const first = getAllFocusable()[0]
      if (first) setFocus(first)
      return
    }
    const next = findClosest(currentFocused, direction)
    if (next) {
      setFocus(next)
    } else if (onEdgeCallback) {
      onEdgeCallback(direction)
    }
    return
  }

  if (KEY_ENTER.indexOf(e.key) >= 0) {
    e.preventDefault()
    if (currentFocused) {
      currentFocused.click()
      currentFocused.dispatchEvent(new CustomEvent('enter', { bubbles: true }))
    }
    return
  }

  if (KEY_BACK.indexOf(e.key) >= 0 || e.keyCode === 10009) {
    e.preventDefault()
    if (onBackCallback) onBackCallback()
    return
  }
}

// --- Public API ---

export function spatialInit(): void {
  document.addEventListener('keydown', handleKeyDown)
}

export function spatialDestroy(): void {
  document.removeEventListener('keydown', handleKeyDown)
  currentFocused = null
}

export function focusElement(el: HTMLElement): void {
  if (el) setFocus(el)
}

export function focusFirst(container?: HTMLElement | Document): void {
  const scope = container || document
  const first = scope.querySelector<HTMLElement>('[data-focusable]:not([disabled])')
  if (first) setFocus(first)
}

export function focusById(id: string): void {
  const el = document.getElementById(id)
  if (el) setFocus(el)
}

export function getCurrentFocused(): HTMLElement | null {
  return currentFocused
}

export function setOnBack(cb: () => void): void {
  onBackCallback = cb
}

export function setOnEdge(cb: ((direction: Direction) => void) | null): void {
  onEdgeCallback = cb
}

export function spatialEnable(): void { enabled = true }
export function spatialDisable(): void { enabled = false }
export function isSpatialEnabled(): boolean { return enabled }

/** Manually trigger edge callback (e.g. from pages with custom key handling) */
export function triggerEdge(direction: 'up' | 'down' | 'left' | 'right'): void {
  if (onEdgeCallback) onEdgeCallback(direction)
}
