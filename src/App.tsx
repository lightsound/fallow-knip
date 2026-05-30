import { Hero } from './components/Hero'
import { FeatureMatrix } from './components/FeatureMatrix'
import { AnalysisPlayground } from './components/AnalysisPlayground'
import { FallowAdvantages } from './components/FallowAdvantages'

export default function App() {
  return (
    <div className="min-h-screen">
      <Hero />
      <main>
        <FeatureMatrix />
        <AnalysisPlayground />
        <FallowAdvantages />
      </main>
      <footer className="border-t border-soil-800 py-8 text-center text-sm text-soil-500">
        Fallow vs Knip 比較デモ — ライブコーディング講座用
      </footer>
    </div>
  )
}
