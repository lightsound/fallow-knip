import { Gauge, Rocket, Shield, Workflow } from 'lucide-react'

const advantages = [
  {
    icon: Rocket,
    title: '3〜36倍 高速',
    description:
      'Rust ネイティブ実装で Node.js ランタイム不要。大規模コードベースでも sub-second で分析完了。',
  },
  {
    icon: Workflow,
    title: '1 ツールで 3 分析',
    description:
      'Dead code・重複検出 (jscpd 代替)・複雑度ホットスポットを単一 CLI で実行。Knip + jscpd + 別ツールが不要に。',
  },
  {
    icon: Shield,
    title: 'アーキテクチャ保護',
    description:
      '循環依存・レイヤー境界違反をゼロコンフィグで検出。feature-sliced / hexagonal プリセット内蔵。',
  },
  {
    icon: Gauge,
    title: 'Agent-ready',
    description:
      'JSON 出力・MCP サーバー・LSP・fix --dry-run で AI コーディングエージェントが構造化 evidence を取得可能。',
  },
]

export function FallowAdvantages() {
  return (
    <section className="border-t border-soil-700/60 bg-gradient-to-b from-sage-500/5 to-transparent">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight">なぜ Fallow か</h2>
          <p className="mx-auto mt-3 max-w-2xl text-soil-300">
            Knip は「未使用コードを見つける」という一点に特化。
            Fallow はコードベース全体の品質・リスク・保守性を扱う
            <strong className="text-sage-300"> intelligence layer </strong>
            です。
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {advantages.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-2xl border border-soil-700 bg-soil-900/50 p-6 transition hover:border-sage-400/30 hover:bg-soil-900/80"
            >
              <div className="mb-4 inline-flex rounded-xl bg-sage-500/15 p-3 text-sage-300">
                <Icon className="size-6" />
              </div>
              <h3 className="text-lg font-semibold text-soil-100">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-soil-400">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
