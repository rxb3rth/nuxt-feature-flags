import { defineNuxtPlugin } from 'nuxt/app'
import { useClientFlags } from './composables'

export default defineNuxtPlugin({
  name: 'feature-flags-fetch-plugin',
  enforce: 'pre',
  async setup() {
    if (import.meta.server) {
      await useClientFlags().fetch()
    }
  },
})
