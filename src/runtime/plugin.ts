import { defineNuxtPlugin } from 'nuxt/app'
import { useClientFlags } from './composables'
import { resolveFlags } from './core'

export default defineNuxtPlugin(async (nuxtApp) => {
  const { $config } = nuxtApp
  const { flags } = useClientFlags()

  const flagDefinitions = $config.public.featureFlags || {}
  const evaluatedFlags = resolveFlags(flagDefinitions)
  flags.value = evaluatedFlags
})
