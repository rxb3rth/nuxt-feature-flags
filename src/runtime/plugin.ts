import { defineNuxtPlugin } from 'nuxt/app'
import { useClientFlags } from './composables'
import { resolveFlags } from './core'

export default defineNuxtPlugin(async (nuxtApp) => {
  const { $config } = nuxtApp
  const { flags } = useClientFlags()

  const definitions = $config.public.featureFlags?.flags || {}
  const evaluatedFlags = await resolveFlags(definitions)
  flags.value = evaluatedFlags
})
