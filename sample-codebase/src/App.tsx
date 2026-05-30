import { ProductCard } from './components/ProductCard'
import { validateCheckout } from './features/checkout/validateCheckout'
import { addToCart, getCartTotal } from './features/cart/cartStore'
import { formatDateJa } from './utils/helpers'

export function App() {
  addToCart({ id: '1', name: 'TypeScript 入門', price: 3200, quantity: 1 })

  const result = validateCheckout({
    email: 'demo@example.com',
    items: [{ sku: 'BOOK-001', qty: 1 }],
    shipping: 'standard',
  })

  return (
    <main>
      <h1>サンプル EC ({formatDateJa(new Date())})</h1>
      <p>合計: ¥{getCartTotal()}</p>
      <p>Checkout: {result.ok ? 'OK' : result.errors.join(', ')}</p>
      <ProductCard name="React 実践" createdAt={new Date()} />
    </main>
  )
}
