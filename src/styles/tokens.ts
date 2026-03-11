/**
 * Design Tokens — centralized style constants
 * Main color: #0F172A (slate-900) — professional, elegant dark theme
 */

export const colors = {
  // Brand
  primary: '#3B82F6',
  primaryHover: '#60A5FA',
  primaryMuted: '#1E3A8A',

  // Background — #0F172A based
  bgDark: '#0F172A',
  bgDeep: '#0B1120',
  surface: '#1E293B',
  surfaceElevated: '#334155',

  // Text
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',

  // Semantic
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Borders
  border: '#334155',
  divider: '#1E293B',

  // Overlay
  overlay: 'rgba(15, 23, 42, 0.85)',
  overlayLight: 'rgba(15, 23, 42, 0.6)',
} as const

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  screenPadding: 96,
  cardGap: 24,
  sectionGap: 48,
} as const

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 9999,
} as const

export const animation = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const
