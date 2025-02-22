import type { H3Event, H3EventContext } from 'h3'
import { useRuntimeConfig } from 'nuxt/app'
import { defu } from 'defu'

export async function getContext(event?: H3Event): Promise<H3EventContext> {
  const runtimeConfig = useRuntimeConfig()
  const defaultContext = runtimeConfig.public.featureFlags.defaultContext || {}
  return defu(event?.context, defaultContext)
}
