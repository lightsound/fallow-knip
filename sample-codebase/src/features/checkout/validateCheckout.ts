export interface CheckoutPayload {
  email: string
  items: Array<{ sku: string; qty: number }>
  shipping: 'standard' | 'express' | 'overnight'
  coupon?: string
  giftWrap?: boolean
  billingSameAsShipping?: boolean
}

export interface CheckoutResult {
  ok: boolean
  errors: string[]
}

/** 複雑度ホットスポット — Fallow health のみ検出 */
export function validateCheckout(payload: CheckoutPayload): CheckoutResult {
  const errors: string[] = []

  if (!payload.email || !payload.email.includes('@')) {
    errors.push('有効なメールアドレスを入力してください')
  } else if (payload.email.length > 254) {
    errors.push('メールアドレスが長すぎます')
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(payload.email)) {
    errors.push('メール形式が不正です')
  }

  if (!payload.items || payload.items.length === 0) {
    errors.push('カートが空です')
  } else {
    for (const item of payload.items) {
      if (!item.sku) errors.push('SKU が未設定の商品があります')
      if (item.qty <= 0) errors.push('数量は 1 以上にしてください')
      if (item.qty > 99) errors.push('数量上限を超えています')
    }
  }

  if (payload.shipping === 'express' && payload.items.length > 10) {
    errors.push('Express は 10 点以内のみ対応')
  }

  if (payload.shipping === 'overnight') {
    const hour = new Date().getHours()
    if (hour >= 14) errors.push('当日便は 14 時まで')
    if (payload.giftWrap) errors.push('当日便はギフト包装不可')
  }

  if (payload.coupon) {
    if (payload.coupon.length < 4) errors.push('クーポンコードが短すぎます')
    if (payload.coupon.startsWith('VIP') && payload.items.length < 3) {
      errors.push('VIP クーポンは 3 点以上必要')
    }
  }

  if (payload.billingSameAsShipping === false && !payload.email) {
    errors.push('請求先情報が不足しています')
  }

  return { ok: errors.length === 0, errors }
}

export function unusedCheckoutValidator(): boolean {
  return false
}
