#!/usr/bin/env tsx
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const sampleDir = path.join(__dirname, '..', 'sample-codebase')

interface RunResult {
  tool: string
  command: string
  durationMs: number
  exitCode: number | null
  stdout: string
  stderr: string
}

function runCommand(
  tool: string,
  command: string,
  args: string[],
  cwd: string,
): Promise<RunResult> {
  return new Promise((resolve) => {
    const start = performance.now()
    let stdout = ''
    let stderr = ''

    const child = spawn(command, args, {
      cwd,
      shell: true,
      env: process.env,
    })

    child.stdout?.on('data', (chunk: Buffer) => {
      stdout += chunk.toString()
    })
    child.stderr?.on('data', (chunk: Buffer) => {
      stderr += chunk.toString()
    })

    child.on('close', (exitCode) => {
      resolve({
        tool,
        command: `${command} ${args.join(' ')}`,
        durationMs: Math.round(performance.now() - start),
        exitCode,
        stdout,
        stderr,
      })
    })
  })
}

function formatMs(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

async function main() {
  console.log('\n⚡ Fallow vs Knip ベンチマーク\n')
  console.log(`対象: ${sampleDir}\n`)
  console.log('─'.repeat(56))

  const runs: RunResult[] = []

  runs.push(
    await runCommand('Knip', 'pnpm', ['exec', 'knip'], sampleDir),
  )
  runs.push(
    await runCommand('Fallow (dead-code)', 'pnpm', ['exec', 'fallow', 'dead-code', '--summary'], sampleDir),
  )
  runs.push(
    await runCommand('Fallow (full)', 'pnpm', ['exec', 'fallow', '--summary'], sampleDir),
  )

  for (const run of runs) {
    console.log(`\n${run.tool}`)
    console.log(`  コマンド: ${run.command}`)
    console.log(`  時間:     ${formatMs(run.durationMs)}`)
    console.log(`  終了:     ${run.exitCode === 0 ? '成功' : `コード ${run.exitCode}`}`)
  }

  const knipMs = runs[0].durationMs
  const fallowDeadMs = runs[1].durationMs
  const fallowFullMs = runs[2].durationMs

  console.log('\n' + '─'.repeat(56))
  console.log('\n📊 サマリー\n')

  if (fallowDeadMs > 0) {
    const ratio = (knipMs / fallowDeadMs).toFixed(1)
    console.log(`  Knip vs Fallow dead-code: ${ratio}x (${formatMs(knipMs)} vs ${formatMs(fallowDeadMs)})`)
  }

  if (fallowFullMs > 0 && knipMs > 0) {
    console.log(
      `  注: Fallow full は dead-code + dupes + health を含む (${formatMs(fallowFullMs)})`,
    )
  }

  console.log('\n💡 ライブデモでは各ツールの出力もターミナルで見せると効果的です。\n')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
