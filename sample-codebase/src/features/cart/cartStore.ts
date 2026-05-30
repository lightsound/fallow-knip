import { getDiscountedCartTotal } from '../pricing/pricingEngine'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

const cart: CartItem[] = []

export function addToCart(item: CartItem): void {
  cart.push(item)
}

export function getCartTotal(): number {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

/** 循環依存: pricingEngine が getCartTotal を import */
export function getCartTotalWithBestDiscount(): number {
  return getDiscountedCartTotal('silver')
}

export function clearCart(): void {
  cart.length = 0
}
