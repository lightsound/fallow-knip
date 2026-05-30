/** 重複ロジック — Fallow dupes のみ検出 */

export function formatDateJa(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}年${month}月${day}日`
}

export function formatDateIso(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function displayUserLabel(name: string): string {
  return `こんにちは、${name}さん`
}

export function computeFee(amount: number, rate: number): number {
  return Math.round(amount * rate * 100) / 100
}
