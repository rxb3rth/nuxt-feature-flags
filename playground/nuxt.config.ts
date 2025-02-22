import { resolve } from 'pathe'

export default defineNuxtConfig({
  modules: ['../src/module'],

  components: true,
  devtools: { enabled: true },

  compatibilityDate: '2025-02-21',

  featureFlags: {
    configFile: resolve(__dirname, 'feature-flags.config.ts'),
  },
})
