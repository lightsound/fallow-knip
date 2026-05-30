import { createRoot } from 'react-dom/client'
import { App } from './App'

/** 分析用エントリポイント（静的解析ツールが参照） */
export function mountApp(container: HTMLElement): void {
  createRoot(container).render(<App />)
}
