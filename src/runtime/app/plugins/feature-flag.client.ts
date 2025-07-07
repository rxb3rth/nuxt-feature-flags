import { defineNuxtPlugin } from 'nuxt/app'
import { useFeatureFlags } from '#imports'

export default defineNuxtPlugin({
  name: 'feature-flags-directive-client',
  setup(nuxtApp) {
    const { isEnabled } = useFeatureFlags()

    // v-feature directive for conditional rendering (client-side only)
    nuxtApp.vueApp.directive('feature', {
      beforeMount(el: HTMLElement, binding) {
        const flagName = binding.value
        const shouldShow = isEnabled(flagName)

        if (!shouldShow) {
          el.style.display = 'none'
        }
      },
      updated(el: HTMLElement, binding) {
        const flagName = binding.value
        const shouldShow = isEnabled(flagName)

        if (!shouldShow) {
          el.style.display = 'none'
        }
        else {
          el.style.display = ''
        }
      },
    })
  },
})
