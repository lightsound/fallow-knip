# Fallow vs Knip — 比較デモ

ライブコーディング講座向けの **Fallow** と **Knip** 比較プロジェクトです。

- **比較 UI**: React + TypeScript + Tailwind（`pnpm dev`）
- **解析プレイグラウンド**: 実際の CLI 出力を UI 上で Knip / Fallow 並列比較
- **分析対象**: `sample-codebase/` に意図的な dead code・重複・循環依存・複雑度を配置

## クイックスタート

```bash
pnpm install
pnpm dev          # 比較 UI を http://localhost:5173 で起動
```

## 解析プレイグラウンド

UI の「解析プレイグラウンド」セクションでは、`sample-codebase/` に対する **実際の Knip / Fallow CLI 出力** を静的スナップショットとして表示します。

- 仕込んだ問題をクリック → 関連行が CLI 出力内でハイライト
- タブ切替で Dead Code / 重複 / ヘルス / 自動修正の出力を確認
- ベンチマーク結果（実行時間）も同セクション内に表示

CLI 出力を更新する場合:

```bash
pnpm capture-outputs   # src/data/cliOutputs.ts を再生成
```

## CLI で比較

```bash
# Knip — 未使用コードのみ
pnpm analyze:knip

# Fallow — フル分析（dead code + 重複 + ヘルス）
pnpm analyze:fallow

# Fallow 個別コマンド
pnpm analyze:fallow:dead-code
pnpm analyze:fallow:dupes
pnpm analyze:fallow:health
pnpm analyze:fallow:fix

# 速度ベンチマーク
pnpm benchmark
```

## サンプルコードベースの仕込み

| 問題 | パス | Knip | Fallow |
|------|------|:----:|:------:|
| 未使用ファイル | `src/unused/orphanedWidget.tsx` | ✓ | ✓ |
| 未使用エクスポート | `src/utils/helpers.ts` | ✓ | ✓ |
| 未使用依存 (lodash) | `package.json` | ✓ | ✓ |
| 重複ロジック | `src/utils/formatDateCopy.ts` | — | ✓ |
| 複雑度ホットスポット | `src/features/checkout/validateCheckout.ts` | — | ✓ |
| 循環依存 | cart ↔ pricing | — | ✓ |

## ライブコーディングの流れ

1. 解析プレイグラウンドで問題と CLI 出力の差を UI 上で説明
2. `pnpm analyze:knip` → Dead Code 系のみ（ターミナルで実演）
3. `pnpm analyze:fallow` → 重複・複雑度・循環依存も表示
4. `pnpm benchmark` → 速度差を実測
5. `pnpm analyze:fallow:fix` → 自動修正プレビュー

## リンク

- [Fallow](https://github.com/fallow-rs/fallow) / [docs](https://docs.fallow.tools)
- [Knip](https://github.com/webpro-nl/knip) / [docs](https://knip.dev)
