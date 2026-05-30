import { useCallback, useState } from 'react'
import { Check, Copy, Play, Terminal } from 'lucide-react'
import { cliCommands } from '../data/comparison'

function CommandBlock({ cmd }: { cmd: string }) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(cmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [cmd])

  return (
    <div className="group flex items-center justify-between gap-3 rounded-lg border border-soil-700 bg-soil-950/80 px-4 py-3 font-mono text-sm">
      <code className="text-sage-300">{cmd}</code>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 rounded-md p-1.5 text-soil-500 opacity-0 transition group-hover:opacity-100 hover:bg-soil-800 hover:text-soil-200"
        aria-label="コピー"
      >
        {copied ? <Check className="size-4 text-sage-400" /> : <Copy className="size-4" />}
      </button>
    </div>
  )
}

export function CommandPanel() {
  return (
    <section id="commands" className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <div className="mb-10">
        <div className="mb-3 inline-flex items-center gap-2 text-sage-300">
          <Terminal className="size-5" />
          <span className="text-sm font-semibold uppercase tracking-widest">CLI デモ</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight">ターミナルで比較を実行</h2>
        <p className="mt-3 max-w-2xl text-soil-300">
          プロジェクトルートで以下のコマンドを実行してください。
          <code className="mx-1 rounded bg-soil-800 px-1.5 py-0.5 font-mono text-sm text-wheat-300">
            pnpm benchmark
          </code>
          で両ツールの実行時間を計測できます。
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-sage-300">
            <Play className="size-4" />
            Fallow
          </h3>
          <div className="space-y-2">
            {cliCommands.fallow.map(({ label, cmd }) => (
              <div key={cmd}>
                <p className="mb-1 text-xs text-soil-500">{label}</p>
                <CommandBlock cmd={cmd} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-ember-400">
            <Play className="size-4" />
            Knip
          </h3>
          <div className="space-y-2">
            {cliCommands.knip.map(({ label, cmd }) => (
              <div key={cmd}>
                <p className="mb-1 text-xs text-soil-500">{label}</p>
                <CommandBlock cmd={cmd} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-wheat-500/20 bg-wheat-500/5 p-6">
        <h3 className="font-semibold text-wheat-300">ライブコーディングの流れ（提案）</h3>
        <ol className="mt-4 space-y-3 text-sm leading-relaxed text-soil-300">
          <li className="flex gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-soil-800 text-xs font-bold text-wheat-400">
              1
            </span>
            <span>
              サンプルコードベースの問題点を UI で説明（未使用ファイル・重複・循環依存など）
            </span>
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
              で速度差を実測（Fallow は Rust ネイティブで sub-second）
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
      </div>
    </section>
  )
}
