import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  ChevronDown,
  Copy,
  FileWarning,
  GitBranch,
  Package,
  Sparkles,
  Terminal,
  TrendingUp,
} from 'lucide-react'
import { sampleIssues, type SampleIssue } from '../data/comparison'
import { benchmarkResults, getSnapshot } from '../data/cliOutputs'
import { TerminalOutput } from './TerminalOutput'

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

type OutputView =
  | 'compare-full'
  | 'dead-code'
  | 'dupes'
  | 'health'
  | 'fix'

const outputViews: { id: OutputView; label: string; knipId?: string; fallowId: string }[] = [
  { id: 'compare-full', label: 'Knip vs フル分析', knipId: 'knip', fallowId: 'fallow-full' },
  { id: 'dead-code', label: 'Dead Code', knipId: 'knip', fallowId: 'fallow-dead-code' },
  { id: 'dupes', label: '重複検出', fallowId: 'fallow-dupes' },
  { id: 'health', label: 'ヘルス / 複雑度', fallowId: 'fallow-health' },
  { id: 'fix', label: '自動修正', fallowId: 'fallow-fix' },
]

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

function BenchmarkBar() {
  const maxMs = Math.max(...benchmarkResults.map((r) => r.durationMs), 1)

  return (
    <div className="rounded-2xl border border-soil-700 bg-soil-900/40 p-6">
      <h3 className="font-semibold text-soil-100">実行時間ベンチマーク</h3>
      <p className="mt-1 text-sm text-soil-400">
        同じ <code className="text-wheat-300">sample-codebase/</code> に対する計測結果（スナップショット）
      </p>
      <div className="mt-5 space-y-4">
        {benchmarkResults.map((result) => {
          const width = `${Math.max((result.durationMs / maxMs) * 100, 8)}%`
          const isKnip = result.tool === 'knip'

          return (
            <div key={result.id}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className={isKnip ? 'text-ember-400' : 'text-sage-300'}>{result.label}</span>
                <span className="font-mono text-soil-400">{result.durationMs}ms</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-soil-800">
                <div
                  className={`h-full rounded-full transition-all ${isKnip ? 'bg-ember-500/70' : 'bg-sage-500/70'}`}
                  style={{ width }}
                />
              </div>
            </div>
          )
        })}
      </div>
      <p className="mt-4 text-xs text-soil-500">
        Fallow full は dead-code + dupes + health を含むにもかかわらず Knip と同等かそれ以上の速度
      </p>
    </div>
  )
}

export function AnalysisPlayground() {
  const [selectedId, setSelectedId] = useState(sampleIssues[0]?.id ?? '')
  const [outputView, setOutputView] = useState<OutputView>('compare-full')
  const [workflowOpen, setWorkflowOpen] = useState(false)

  const selectedIssue = sampleIssues.find((issue) => issue.id === selectedId) ?? sampleIssues[0]
  const currentView = outputViews.find((view) => view.id === outputView) ?? outputViews[0]
  const fallowOnly = sampleIssues.filter((issue) => issue.fallowFinds && !issue.knipFinds)

  const knipSnapshot = currentView.knipId ? getSnapshot(currentView.knipId) : undefined
  const fallowSnapshot = getSnapshot(currentView.fallowId)

  const knipEmptyMessage = useMemo(() => {
    if (!selectedIssue) return '— 検出なし —'
    if (!selectedIssue.knipFinds) return 'Knip は Dead Code 系のみ検出 — この問題タイプは対象外'
    return '— 検出なし —'
  }, [selectedIssue])

  const summaryText = selectedIssue
    ? selectedIssue.knipFinds && selectedIssue.fallowFinds
      ? 'Knip と Fallow の両方が検出します。出力内のハイライト行を比較してください。'
      : selectedIssue.fallowFinds
        ? 'Fallow のみが検出します。Knip の出力には該当行がありません。'
        : 'この問題はどちらのツールでも検出されません。'
    : ''

  return (
    <section id="playground" className="border-y border-soil-700/60 bg-soil-900/30">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="mb-10">
          <div className="mb-3 inline-flex items-center gap-2 text-sage-300">
            <Sparkles className="size-5" />
            <span className="text-sm font-semibold uppercase tracking-widest">解析プレイグラウンド</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">CLI 出力をその場で比較</h2>
          <p className="mt-3 max-w-3xl text-soil-300">
            <code className="rounded bg-soil-800 px-1.5 py-0.5 font-mono text-sm text-wheat-300">
              sample-codebase/
            </code>{' '}
            に対する実際の Knip / Fallow 出力を並べて表示します。問題を選ぶと、関連する行がハイライトされます。
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-soil-500">
              仕込んだ問題（クリックで選択）
            </h3>
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

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {sampleIssues.map((issue) => {
            const config = typeConfig[issue.type]
            const Icon = config.icon
            const isSelected = issue.id === selectedId
            const fallowOnlyIssue = issue.fallowFinds && !issue.knipFinds

            return (
              <button
                key={issue.id}
                type="button"
                onClick={() => setSelectedId(issue.id)}
                className={`rounded-2xl border p-4 text-left transition ${
                  isSelected
                    ? 'border-wheat-400/40 bg-wheat-500/10 ring-1 ring-wheat-400/20'
                    : fallowOnlyIssue
                      ? 'border-sage-400/30 bg-sage-500/5 hover:border-sage-400/50'
                      : 'border-soil-700 bg-soil-900/50 hover:border-soil-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`rounded-lg bg-soil-800 p-2 ${config.color}`} aria-hidden>
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
                    <h4 className="mt-1 font-semibold text-soil-100">{issue.title}</h4>
                    <p className="mt-1 line-clamp-2 text-sm text-soil-400">{issue.description}</p>
                    <div className="mt-3 flex gap-2">
                      <DetectionBadge finds={issue.fallowFinds} tool="fallow" />
                      <DetectionBadge finds={issue.knipFinds} tool="knip" />
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-12">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-soil-200">
              <Terminal className="size-5 text-sage-300" />
              <h3 className="font-semibold">CLI 出力比較</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {outputViews.map((view) => (
                <button
                  key={view.id}
                  type="button"
                  onClick={() => setOutputView(view.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    outputView === view.id
                      ? 'bg-sage-500/20 text-sage-200 ring-1 ring-sage-400/30'
                      : 'bg-soil-800 text-soil-400 hover:bg-soil-700 hover:text-soil-200'
                  }`}
                >
                  {view.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <TerminalOutput
              title="Knip"
              command={knipSnapshot?.command ?? 'pnpm analyze:knip'}
              output={knipSnapshot?.output ?? ''}
              durationMs={knipSnapshot?.durationMs}
              exitCode={knipSnapshot?.exitCode}
              highlightPatterns={selectedIssue?.highlightPatterns ?? []}
              emptyMessage={knipEmptyMessage}
              accent="ember"
            />
            <TerminalOutput
              title="Fallow"
              command={fallowSnapshot?.command ?? 'pnpm analyze:fallow'}
              output={fallowSnapshot?.output ?? ''}
              durationMs={fallowSnapshot?.durationMs}
              exitCode={fallowSnapshot?.exitCode}
              highlightPatterns={selectedIssue?.highlightPatterns ?? []}
              emptyMessage="— 出力なし —"
              accent="sage"
            />
          </div>
        </div>

        {selectedIssue && (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-soil-700 bg-soil-900/50 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-soil-500">
                ソースコード
              </h3>
              <p className="mt-1 font-mono text-xs text-soil-500">{selectedIssue.file}</p>
              <pre className="mt-4 overflow-x-auto rounded-xl border border-soil-800 bg-soil-950/80 p-4 font-mono text-xs leading-relaxed text-soil-200">
                {selectedIssue.codeSnippet}
              </pre>
            </div>
            <div className="rounded-2xl border border-soil-700 bg-soil-900/50 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-soil-500">
                検出サマリー
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-soil-300">{summaryText}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-xl border border-ember-400/20 bg-ember-500/5 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-ember-400">Knip</p>
                  <p className="mt-1 text-sm text-soil-200">
                    {selectedIssue.knipFinds ? 'この問題を検出' : '検出対象外'}
                  </p>
                </div>
                <div className="rounded-xl border border-sage-400/20 bg-sage-500/5 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-sage-300">Fallow</p>
                  <p className="mt-1 text-sm text-soil-200">
                    {selectedIssue.fallowFinds ? 'この問題を検出' : '検出対象外'}
                  </p>
                </div>
              </div>
              <p className="mt-6 text-xs text-soil-500">
                ターミナルで再現:{' '}
                <code className="text-wheat-300">
                  {selectedIssue.knipFinds ? 'pnpm analyze:knip' : 'pnpm analyze:fallow'}
                </code>
              </p>
            </div>
          </div>
        )}

        <div className="mt-10">
          <BenchmarkBar />
        </div>

        <div className="mt-10 rounded-2xl border border-wheat-500/20 bg-wheat-500/5">
          <button
            type="button"
            onClick={() => setWorkflowOpen((open) => !open)}
            className="flex w-full items-center justify-between px-6 py-4 text-left"
          >
            <h3 className="font-semibold text-wheat-300">ライブコーディングの流れ（提案）</h3>
            <ChevronDown
              className={`size-5 text-wheat-400 transition ${workflowOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {workflowOpen && (
            <ol className="space-y-3 border-t border-wheat-500/10 px-6 py-4 text-sm leading-relaxed text-soil-300">
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-soil-800 text-xs font-bold text-wheat-400">
                  1
                </span>
                <span>解析プレイグラウンドで問題と CLI 出力の差を説明</span>
              </li>
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-soil-800 text-xs font-bold text-wheat-400">
                  2
                </span>
                <span>
                  <code className="font-mono text-wheat-300">pnpm analyze:knip</code>{' '}
                  を実行 → Dead Code のみ検出されることを確認
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-soil-800 text-xs font-bold text-wheat-400">
                  3
                </span>
                <span>
                  <code className="font-mono text-wheat-300">pnpm analyze:fallow</code>{' '}
                  を実行 → 重複・複雑度・循環依存も一括表示
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-soil-800 text-xs font-bold text-wheat-400">
                  4
                </span>
                <span>
                  <code className="font-mono text-wheat-300">pnpm benchmark</code>{' '}
                  で速度差を実測
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-soil-800 text-xs font-bold text-wheat-400">
                  5
                </span>
                <span>
                  <code className="font-mono text-wheat-300">pnpm analyze:fallow:fix</code>{' '}
                  で自動修正プレビューをデモ
                </span>
              </li>
            </ol>
          )}
        </div>
      </div>
    </section>
  )
}
