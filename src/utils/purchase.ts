import type { PurchaseStatus, Channel } from '@/types'

export function purchaseBadgeColor(ps: PurchaseStatus): string {
  switch (ps) {
    case 'FREE':
    case 'PURCHASED':
      return '#10B981'
    case 'IN_OTHER_SUBSCRIPTION':
      return '#F59E0B'
    case 'PAYABLE':
      return '#3B82F6'
    case 'PREORDERED':
      return '#8B5CF6'
    case 'CALL_OPERATOR':
      return '#EF4444'
    default:
      return '#6B7280'
  }
}

export function purchaseBadgeLabel(ps: PurchaseStatus): string {
  switch (ps) {
    case 'FREE':
    case 'PURCHASED':
      return ''
    case 'IN_OTHER_SUBSCRIPTION':
      return 'SUB'
    case 'PAYABLE':
      return 'BUY'
    case 'PREORDERED':
      return 'PRE'
    case 'CALL_OPERATOR':
      return 'CALL'
    default:
      return ''
  }
}

export function showPurchaseBadge(ch: Channel): boolean {
  return ch.purchaseStatus !== 'FREE' && ch.purchaseStatus !== 'PURCHASED'
}
