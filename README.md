# Fallow vs Knip — 比較デモ

ライブコーディング講座向けの **Fallow** と **Knip** 比較プロジェクトです。

- **比較 UI**: React + TypeScript + Tailwind（`pnpm dev`）
- **分析対象**: `sample-codebase/` に意図的な dead code・重複・循環依存・複雑度を配置

## クイックスタート

```bash
pnpm install
pnpm dev          # 比較 UI を http://localhost:5173 で起動
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

1. UI (`pnpm dev`) で機能比較マトリクスとサンプル問題を説明
2. `pnpm analyze:knip` → Dead Code 系のみ
3. `pnpm analyze:fallow` → 重複・複雑度・循環依存も表示
4. `pnpm benchmark` → 速度差を実測
5. `pnpm analyze:fallow:fix` → 自動修正プレビュー

## リンク

- [Fallow](https://github.com/fallow-rs/fallow) / [docs](https://docs.fallow.tools)
- [Knip](https://github.com/webpro-nl/knip) / [docs](https://knip.dev)
