import {
  AlertTriangle,
  Copy,
  FileWarning,
  GitBranch,
  Package,
  TrendingUp,
} from 'lucide-react'
import { sampleIssues, type SampleIssue } from '../data/comparison'

const typeConfig: Record<
  SampleIssue['type'],
  { icon: typeof FileWarning; label: string; color: string }
> = {
  'dead-code': { icon: FileWarning, label: 'Dead Code', color: 'text-amber-400' },
  duplication: { icon: Copy, label: '重複', color: 'text-sky-400' },
  complexity: { icon: TrendingUp, label: '複雑度', color: 'text-violet-400' },
  architecture: { icon: GitBranch, label: 'アーキテクチャ', color: 'text-rose-400' },
  dependency: { icon: Package, label: '依存関係', color: 'text-orange-400' },
}

function DetectionBadge({ finds, tool }: { finds: boolean; tool: 'fallow' | 'knip' }) {
  const isFallow = tool === 'fallow'
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
        finds
          ? isFallow
            ? 'bg-sage-500/20 text-sage-300'
            : 'bg-ember-500/20 text-ember-400'
          : 'bg-soil-800 text-soil-500'
      }`}
    >
      {finds ? '検出' : '—'}
    </span>
  )
}

export function SampleIssues() {
  const fallowOnly = sampleIssues.filter((i) => i.fallowFinds && !i.knipFinds)

  return (
    <section id="sample" className="border-y border-soil-700/60 bg-soil-900/30">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">サンプルコードベース</h2>
            <p className="mt-3 max-w-2xl text-soil-300">
              <code className="rounded bg-soil-800 px-1.5 py-0.5 font-mono text-sm text-wheat-300">
                sample-codebase/
              </code>{' '}
              に意図的に問題を仕込んであります。CLI を実行して両ツールの差を確認してください。
            </p>
          </div>
          {fallowOnly.length > 0 && (
            <div className="flex items-start gap-3 rounded-xl border border-sage-400/30 bg-sage-500/10 px-4 py-3 text-sm text-sage-200">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-sage-300" />
              <span>
                <strong>{fallowOnly.length} 件</strong>は Fallow のみが検出
              </span>
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {sampleIssues.map((issue) => {
            const config = typeConfig[issue.type]
            const Icon = config.icon
            const fallowOnlyIssue = issue.fallowFinds && !issue.knipFinds

            return (
              <article
                key={issue.id}
                className={`rounded-2xl border p-5 transition hover:border-soil-600 ${
                  fallowOnlyIssue
                    ? 'border-sage-400/30 bg-sage-500/5'
                    : 'border-soil-700 bg-soil-900/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`rounded-lg bg-soil-800 p-2 ${config.color}`}
                    aria-hidden
                  >
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-soil-500">
                        {config.label}
                      </span>
                      {fallowOnlyIssue && (
                        <span className="rounded-full bg-wheat-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-wheat-300">
                          Fallow only
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1 font-semibold text-soil-100">{issue.title}</h3>
                    <p className="mt-1 text-sm text-soil-400">{issue.description}</p>
                    <code className="mt-3 block truncate font-mono text-xs text-soil-500">
                      {issue.file}
                    </code>
                    <div className="mt-4 flex gap-3">
                      <DetectionBadge finds={issue.fallowFinds} tool="fallow" />
                      <DetectionBadge finds={issue.knipFinds} tool="knip" />
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
