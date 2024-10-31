import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => ({
  test: {
    environment: 'edge-runtime',
    server: { deps: { inline: ['convex-test'] } },
    env: loadEnv(mode, process.cwd(), ''),
  },
}))
