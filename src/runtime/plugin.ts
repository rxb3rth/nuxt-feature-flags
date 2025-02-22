import { defineNuxtPlugin } from 'nuxt/app'
import { defu } from 'defu'
import { useFeatureFlags } from './composables'
import { evaluateFlags, getContext } from './core'

export default defineNuxtPlugin(async (nuxtApp) => {
  const { $config } = nuxtApp
  const { flags } = useFeatureFlags()

  const context = await getContext(nuxtApp.ssrContext?.event)

  const mergedContext = defu(
    context,
    $config.public.featureFlags.defaultContext || {},
  )

  const flagDefinitions = $config.public.featureFlags.flags || {}
  const evaluatedFlags = evaluateFlags(flagDefinitions, mergedContext)
  flags.value = evaluatedFlags
})
