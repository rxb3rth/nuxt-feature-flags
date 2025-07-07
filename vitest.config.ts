import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        'playground/**',
        '**/*.d.ts',
        'test/**',
      ],
    },
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, '.'),
      '#imports': resolve(__dirname, 'test/mocks/imports.ts'),
      '#feature-flags/types': resolve(__dirname, 'test/mocks/types.ts'),
      '#feature-flags/config': resolve(__dirname, 'test/mocks/config.ts'),
      '#feature-flags/handler': resolve(__dirname, 'src/runtime/server/handlers/feature-flags.ts'),
    },
  },
})
