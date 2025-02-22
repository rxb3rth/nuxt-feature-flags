export default defineNuxtConfig({
  modules: ['../src/module'],

  components: true,
  devtools: { enabled: true },

  experimental: {
    renderJsonPayloads: true,
  },

  compatibilityDate: '2025-02-21',

  featureFlags: {
    config: '~/flags.config',
    flags: {
      experimentalFeature: true,
    },
    // context: {
    //   user: {
    //     isAdmin: true,
    //   },
    // },
    context: '~/flags.context',
    inherit: true,
  },
})
