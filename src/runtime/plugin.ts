import { defineNuxtPlugin } from 'nuxt/app'
import { useClientFlags } from './composables'
import { getFlags, resolveFlags } from './core'

export default defineNuxtPlugin(async (nuxtApp) => {
  const { flags } = useClientFlags()

  const definitions = getFlags(nuxtApp.ssrContext?.config, nuxtApp.$config)
  const evaluatedFlags = await resolveFlags(definitions)
  flags.value = evaluatedFlags
})
