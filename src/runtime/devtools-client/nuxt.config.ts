import { resolve } from 'pathe'

export default defineNuxtConfig({
  modules: [
    '@nuxt/devtools-ui-kit',
  ],
  ssr: false,
  nitro: {
    output: {
      publicDir: resolve(__dirname, '../../../dist/client'),
    },
  },
  app: {
    baseURL: '/__nuxt-feature-flags',
  },
  vite: {
    server: {
      hmr: {
        // Instead of go through proxy, we directly connect real port of the client app
        clientPort: +(process.env.PORT || 3300),
      },
    },
  },
  devtools: {
    enabled: false,
  },
  compatibilityDate: '2024-08-21',
})
