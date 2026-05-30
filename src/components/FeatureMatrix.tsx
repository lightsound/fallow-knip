import { Check, Minus, Star } from 'lucide-react'
import { featureMatrix } from '../data/comparison'

function CellValue({ value }: { value: boolean | 'partial' | string }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sage-300">
        <Check className="size-4 shrink-0" strokeWidth={2.5} />
        <span className="sr-only">対応</span>
      </span>
    )
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center gap-1.5 text-soil-500">
        <Minus className="size-4 shrink-0" />
        <span className="sr-only">非対応</span>
      </span>
    )
  }
  if (value === 'partial') {
    return <span className="text-sm text-wheat-400">一部</span>
  }
  return <span className="text-sm text-soil-300">{value}</span>
}

export function FeatureMatrix() {
  const categories = [...new Set(featureMatrix.map((r) => r.category))]

  return (
    <section id="compare" className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight">機能比較マトリクス</h2>
        <p className="mt-3 max-w-2xl text-soil-300">
          Knip は未使用コード検出に強い一方、Fallow は
          <strong className="text-sage-300"> 重複・複雑度・アーキテクチャ </strong>
          まで一つのツールでカバーします。
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-soil-700 bg-soil-900/40">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-soil-700 bg-soil-800/50">
                <th className="px-5 py-4 font-semibold text-soil-200">機能</th>
                <th className="px-5 py-4 font-semibold text-sage-300">
                  <span className="inline-flex items-center gap-2">Fallow</span>
                </th>
                <th className="px-5 py-4 font-semibold text-ember-400">Knip</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => {
                const rows = featureMatrix.filter((r) => r.category === category)
                return rows.map((row, idx) => (
                  <tr
                    key={`${category}-${row.feature}`}
                    className={`border-b border-soil-800/80 transition hover:bg-soil-800/30 ${
                      row.highlight ? 'bg-sage-500/5' : ''
                    }`}
                  >
                    <td className="px-5 py-4">
                      {idx === 0 && (
                        <span className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-soil-500">
                          {category}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-2 font-medium text-soil-100">
                        {row.feature}
                        {row.highlight && (
                          <Star className="size-3.5 fill-wheat-400 text-wheat-400" aria-hidden />
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <CellValue value={row.fallow} />
                    </td>
                    <td className="px-5 py-4">
                      <CellValue value={row.knip} />
                    </td>
                  </tr>
                ))
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-xs text-soil-500">
        ★ = Fallow のみ、または Fallow が明確に優位な機能
      </p>
    </section>
  )
}
