import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'

interface TerminalOutputProps {
  title: string
  command: string
  output: string
  durationMs?: number
  exitCode?: number
  highlightPatterns?: string[]
  emptyMessage?: string
  accent?: 'sage' | 'ember' | 'neutral'
}

function lineMatches(line: string, patterns: string[]): boolean {
  if (patterns.length === 0) return false
  const lower = line.toLowerCase()
  return patterns.some((pattern) => lower.includes(pattern.toLowerCase()))
}

export function TerminalOutput({
  title,
  command,
  output,
  durationMs,
  exitCode,
  highlightPatterns = [],
  emptyMessage = '— 検出なし —',
  accent = 'neutral',
}: TerminalOutputProps) {
  const [copied, setCopied] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const firstMatchRef = useRef<HTMLDivElement>(null)

  const lines = useMemo(() => {
    if (!output.trim()) return []
    return output.split('\n')
  }, [output])

  const hasMatch = useMemo(
    () => lines.some((line) => lineMatches(line, highlightPatterns)),
    [lines, highlightPatterns],
  )

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(output || emptyMessage)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [output, emptyMessage])

  useEffect(() => {
    if (hasMatch && firstMatchRef.current) {
      firstMatchRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, [hasMatch, highlightPatterns, output])

  const accentBorder =
    accent === 'sage'
      ? 'border-sage-400/30'
      : accent === 'ember'
        ? 'border-ember-400/30'
        : 'border-soil-700'

  const accentDot =
    accent === 'sage' ? 'bg-sage-400' : accent === 'ember' ? 'bg-ember-400' : 'bg-soil-500'

  return (
    <div className={`flex min-h-[320px] flex-col overflow-hidden rounded-xl border ${accentBorder} bg-soil-950/80`}>
      <div className="flex items-center justify-between gap-3 border-b border-soil-800 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex shrink-0 gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-rose-500/80" />
            <span className="size-2.5 rounded-full bg-wheat-400/80" />
            <span className={`size-2.5 rounded-full ${accentDot}`} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-soil-200">{title}</p>
            <p className="truncate font-mono text-[11px] text-soil-500">{command}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {durationMs !== undefined && (
            <span className="rounded-md bg-soil-800 px-2 py-0.5 font-mono text-[10px] text-soil-400">
              {durationMs}ms
            </span>
          )}
          {exitCode !== undefined && (
            <span
              className={`rounded-md px-2 py-0.5 font-mono text-[10px] ${
                exitCode === 0 ? 'bg-sage-500/20 text-sage-300' : 'bg-ember-500/15 text-ember-400'
              }`}
            >
              exit {exitCode}
            </span>
          )}
          <button
            type="button"
            onClick={copy}
            className="rounded-md p-1.5 text-soil-500 transition hover:bg-soil-800 hover:text-soil-200"
            aria-label="出力をコピー"
          >
            {copied ? <Check className="size-3.5 text-sage-400" /> : <Copy className="size-3.5" />}
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed">
        {lines.length === 0 ? (
          <p className="text-soil-500">{emptyMessage}</p>
        ) : (
          <div className="space-y-0">
            {lines.map((line, index) => {
              const highlighted = lineMatches(line, highlightPatterns)
              const isFirstMatch = highlighted && !lines.slice(0, index).some((l) => lineMatches(l, highlightPatterns))

              return (
                <div
                  key={`${index}-${line.slice(0, 24)}`}
                  ref={isFirstMatch ? firstMatchRef : undefined}
                  className={`whitespace-pre-wrap break-all px-2 py-0.5 ${
                    highlighted
                      ? 'rounded bg-wheat-500/15 text-wheat-200 ring-1 ring-wheat-500/20'
                      : 'text-soil-300'
                  }`}
                >
                  {line || ' '}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
