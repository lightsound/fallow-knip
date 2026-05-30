import { formatDateJa } from '../utils/helpers'

export function ProductCard({ name, createdAt }: { name: string; createdAt: Date }) {
  return (
    <article className="product-card">
      <h3>{name}</h3>
      <time>{formatDateJa(createdAt)}</time>
    </article>
  )
}
