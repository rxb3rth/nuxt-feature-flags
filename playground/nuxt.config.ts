export default defineNuxtConfig({
  modules: ['../src/module'],

  components: true,
  devtools: { enabled: true },

  compatibilityDate: '2025-02-21',

  featureFlags: {
    flags: {
      newDashboard: true,
      experimentalFeature: true,
    },
  },
})
