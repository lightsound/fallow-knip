export type ToolId = 'fallow' | 'knip'

export interface FeatureRow {
  category: string
  feature: string
  fallow: boolean | 'partial' | string
  knip: boolean | 'partial' | string
  highlight?: boolean
}

export const featureMatrix: FeatureRow[] = [
  {
    category: 'Dead Code',
    feature: '未使用ファイル',
    fallow: true,
    knip: true,
  },
  {
    category: 'Dead Code',
    feature: '未使用エクスポート',
    fallow: true,
    knip: true,
  },
  {
    category: 'Dead Code',
    feature: '未使用依存関係 (package.json)',
    fallow: true,
    knip: true,
  },
  {
    category: 'Dead Code',
    feature: '未使用型・enum メンバー',
    fallow: true,
    knip: 'partial',
  },
  {
    category: 'Dead Code',
    feature: '自動修正 (fix --dry-run)',
    fallow: true,
    knip: false,
    highlight: true,
  },
  {
    category: '重複検出',
    feature: 'コピペ clone 検出',
    fallow: true,
    knip: false,
    highlight: true,
  },
  {
    category: '重複検出',
    feature: 'セマンティック clone (変数名変更)',
    fallow: true,
    knip: false,
    highlight: true,
  },
  {
    category: 'ヘルス',
    feature: '複雑度ホットスポット',
    fallow: true,
    knip: false,
    highlight: true,
  },
  {
    category: 'ヘルス',
    feature: '品質スコア & グレード',
    fallow: true,
    knip: false,
    highlight: true,
  },
  {
    category: 'アーキテクチャ',
    feature: '循環依存',
    fallow: true,
    knip: false,
    highlight: true,
  },
  {
    category: 'アーキテクチャ',
    feature: 'レイヤー境界違反',
    fallow: true,
    knip: false,
    highlight: true,
  },
  {
    category: 'CI / Agent',
    feature: 'PR 監査 (audit)',
    fallow: true,
    knip: false,
    highlight: true,
  },
  {
    category: 'CI / Agent',
    feature: 'JSON / MCP / LSP',
    fallow: true,
    knip: 'partial',
  },
  {
    category: 'パフォーマンス',
    feature: 'Rust ネイティブ (Node 不要)',
    fallow: true,
    knip: false,
    highlight: true,
  },
  {
    category: 'パフォーマンス',
    feature: 'ゼロコンフィグ (95+ プラグイン)',
    fallow: true,
    knip: 'partial',
  },
]

export interface SampleIssue {
  id: string
  type: 'dead-code' | 'duplication' | 'complexity' | 'architecture' | 'dependency'
  title: string
  description: string
  file: string
  fallowFinds: boolean
  knipFinds: boolean
}

export const sampleIssues: SampleIssue[] = [
  {
    id: 'unused-file',
    type: 'dead-code',
    title: '未使用ファイル',
    description: 'どこからも import されていない orphaned モジュール',
    file: 'sample-codebase/src/unused/orphanedWidget.tsx',
    fallowFinds: true,
    knipFinds: true,
  },
  {
    id: 'unused-export',
    type: 'dead-code',
    title: '未使用エクスポート',
    description: '公開されているが参照されていない関数',
    file: 'sample-codebase/src/utils/helpers.ts',
    fallowFinds: true,
    knipFinds: true,
  },
  {
    id: 'unused-dep',
    type: 'dependency',
    title: '未使用依存関係',
    description: 'package.json にあるが import されていない lodash',
    file: 'sample-codebase/package.json',
    fallowFinds: true,
    knipFinds: true,
  },
  {
    id: 'duplicated-format',
    type: 'duplication',
    title: '重複ロジック',
    description: '2 ファイルにほぼ同一の日付フォーマット処理',
    file: 'sample-codebase/src/utils/formatDate*.ts',
    fallowFinds: true,
    knipFinds: false,
  },
  {
    id: 'complex-checkout',
    type: 'complexity',
    title: '複雑度ホットスポット',
    description: '分岐だらけの checkout バリデーション関数',
    file: 'sample-codebase/src/features/checkout/validateCheckout.ts',
    fallowFinds: true,
    knipFinds: false,
  },
  {
    id: 'circular-deps',
    type: 'architecture',
    title: '循環依存',
    description: 'cart ↔ pricing モジュール間の相互 import',
    file: 'sample-codebase/src/features/cart/cartStore.ts',
    fallowFinds: true,
    knipFinds: false,
  },
]

export const cliCommands = {
  fallow: [
    { label: 'フル分析', cmd: 'pnpm analyze:fallow' },
    { label: 'Dead Code のみ', cmd: 'pnpm analyze:fallow:dead-code' },
    { label: '重複検出', cmd: 'pnpm analyze:fallow:dupes' },
    { label: 'ヘルス / 複雑度', cmd: 'pnpm analyze:fallow:health' },
    { label: '自動修正プレビュー', cmd: 'pnpm analyze:fallow:fix' },
    { label: 'ベンチマーク', cmd: 'pnpm benchmark' },
  ],
  knip: [
    { label: '未使用コード分析', cmd: 'pnpm analyze:knip' },
    { label: 'ベンチマーク', cmd: 'pnpm benchmark' },
  ],
} as const

export const toolMeta = {
  fallow: {
    name: 'Fallow',
    tagline: 'Codebase Intelligence',
    description:
      'Dead code・重複・複雑度・アーキテクチャを Rust ネイティブで一括分析。AI エージェント向け JSON / MCP / LSP も標準装備。',
    repo: 'https://github.com/fallow-rs/fallow',
    docs: 'https://docs.fallow.tools',
    color: 'sage',
  },
  knip: {
    name: 'Knip',
    tagline: 'Unused Code Finder',
    description:
      '未使用ファイル・エクスポート・依存関係の検出に特化。Node.js 上で動作する実績あるツール。',
    repo: 'https://github.com/webpro-nl/knip',
    docs: 'https://knip.dev',
    color: 'ember',
  },
} as const
