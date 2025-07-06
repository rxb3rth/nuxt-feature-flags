export default defineNuxtConfig({
  modules: ['../src/module'],
  
  compatibilityDate: '2025-02-21',
  
  future: {
    compatibilityVersion: 4,
  },

  components: true,
  devtools: { enabled: true },

  featureFlags: {
    config: './feature-flags.config.ts',
  },
})
