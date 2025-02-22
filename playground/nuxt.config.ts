export default defineNuxtConfig({
  modules: ['../src/module'],

  components: true,
  devtools: { enabled: true },

  compatibilityDate: '2025-02-21',

  featureFlags: {
    config: '~/flags.config',
    flags: {
      experimentalFeature: true,
    },
    inherit: true,
  },
})
