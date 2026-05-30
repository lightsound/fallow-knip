import { getCartTotal } from '../cart/cartStore'

export type DiscountTier = 'none' | 'bronze' | 'silver' | 'gold'

export function applyDiscount(total: number, tier: DiscountTier): number {
  switch (tier) {
    case 'bronze':
      return total * 0.95
    case 'silver':
      return total * 0.9
    case 'gold':
      return total * 0.85
    default:
      return total
  }
}

/** 循環依存: cartStore がこのモジュールを import し、こちらも cart を参照 */
export function getDiscountedCartTotal(tier: DiscountTier): number {
  const total = getCartTotal()
  return applyDiscount(total, tier)
}

export function unusedPricingHelper(): number {
  return 0
}
