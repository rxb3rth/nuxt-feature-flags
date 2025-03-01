import { defineNuxtPlugin } from 'nuxt/app'
import { useFeatureFlags } from '#imports'

export default defineNuxtPlugin({
  name: 'feature-flags-fetch-plugin',
  enforce: 'pre',
  async setup() {
    await useFeatureFlags().fetch()
  },
})
