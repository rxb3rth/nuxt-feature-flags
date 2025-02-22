export default defineNuxtConfig({
  modules: ['../src/module'],

  components: true,
  devtools: { enabled: true },

  compatibilityDate: '2025-02-21',

  featureFlags: {
    newDashboard: true,
    experimentalFeature: true,
    generalAvailability: true,
  },
})
