import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: ['src/main.tsx', 'src/App.tsx'],
  project: ['src/**/*.{ts,tsx}'],
  ignore: [],
  ignoreDependencies: [],
}

export default config
