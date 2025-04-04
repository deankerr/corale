import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => ({
  test: {
    environment: 'edge-runtime',
    server: { deps: { inline: ['convex-test'] } },
    env: loadEnv(mode, process.cwd(), ''),
    alias: {
      '~/': new URL('./convex/', import.meta.url).pathname,
    },
    reporters: process.env.GITHUB_ACTIONS ? ['verbose', 'github-actions'] : 'verbose',
    outputFile: process.env.GITHUB_ACTIONS ? 'vitest-result.json' : undefined,
  },
}))
