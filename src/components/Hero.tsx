import { ArrowRight, ExternalLink, Globe, Sparkles, Zap } from 'lucide-react'
import { toolMeta } from '../data/comparison'

export function Hero() {
  return (
    <header className="relative overflow-hidden border-b border-soil-700/60">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -20%, color-mix(in srgb, var(--color-sage-500) 30%, transparent), transparent)',
        }}
      />
      <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-sage-400/30 bg-sage-500/10 px-4 py-1.5 text-sm text-sage-300">
          <Sparkles className="size-4" />
          ライブコーディング講座用デモ
        </div>

        <h1 className="animate-fade-up max-w-3xl text-4xl font-bold tracking-tight text-soil-100 md:text-6xl [animation-delay:80ms]">
          Fallow vs Knip
          <span className="mt-2 block text-2xl font-medium text-soil-300 md:text-3xl">
            コードベース分析ツール比較
          </span>
        </h1>

        <p className="animate-fade-up mt-6 max-w-2xl text-lg leading-relaxed text-soil-300 [animation-delay:160ms]">
          同じサンプルプロジェクトを両ツールで分析し、
          <strong className="font-semibold text-wheat-300">速度</strong>・
          <strong className="font-semibold text-wheat-300">検出範囲</strong>・
          <strong className="font-semibold text-wheat-300">開発者体験</strong>
          の違いを体感できます。
        </p>

        <div className="animate-fade-up mt-10 flex flex-wrap gap-4 [animation-delay:240ms]">
          <a
            href="#compare"
            className="inline-flex items-center gap-2 rounded-xl bg-sage-500 px-5 py-3 text-sm font-semibold text-soil-950 transition hover:bg-sage-400"
          >
            機能比較を見る
            <ArrowRight className="size-4" />
          </a>
          <a
            href="#commands"
            className="inline-flex items-center gap-2 rounded-xl border border-soil-600 bg-soil-800/60 px-5 py-3 text-sm font-semibold text-soil-100 transition hover:border-soil-500 hover:bg-soil-800"
          >
            <Zap className="size-4 text-wheat-400" />
            CLI で試す
          </a>
        </div>

        <div className="animate-fade-up mt-14 grid gap-4 sm:grid-cols-2 [animation-delay:320ms]">
          {(['fallow', 'knip'] as const).map((id) => {
            const tool = toolMeta[id]
            const isFallow = id === 'fallow'
            return (
              <article
                key={id}
                className={`rounded-2xl border p-6 backdrop-blur-sm ${
                  isFallow
                    ? 'animate-pulse-glow border-sage-400/40 bg-sage-500/5'
                    : 'border-soil-700 bg-soil-900/60'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p
                      className={`text-xs font-semibold uppercase tracking-widest ${
                        isFallow ? 'text-sage-300' : 'text-ember-400'
                      }`}
                    >
                      {tool.tagline}
                    </p>
                    <h2 className="mt-1 text-2xl font-bold">{tool.name}</h2>
                  </div>
                  <a
                    href={tool.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg p-2 text-soil-400 transition hover:bg-soil-800 hover:text-soil-100"
                    aria-label={`${tool.name} GitHub`}
                  >
                    <Globe className="size-5" />
                  </a>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-soil-300">{tool.description}</p>
                <a
                  href={tool.docs}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-wheat-400 hover:text-wheat-300"
                >
                  ドキュメント
                  <ExternalLink className="size-3.5" />
                </a>
              </article>
            )
          })}
        </div>
      </div>
    </header>
  )
}
