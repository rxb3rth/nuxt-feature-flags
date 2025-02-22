import type { H3Event } from 'h3'
import { useRuntimeConfig } from 'nitropack/runtime'
import { defu } from 'defu'
import type { EvaluationContext } from '../types'

export function resolveFlagsConfig(event?: H3Event) {
  const runtimeConfig = useRuntimeConfig()
  return event?.context?.featureFlagsConfig || runtimeConfig.public.featureFlags || {}
}

export async function getContext(event?: H3Event): Promise<EvaluationContext> {
  const runtimeConfig = useRuntimeConfig()
  const defaultContext = runtimeConfig.public.featureFlags.defaultContext || {}
  return defu(event?.context?.featureFlags, defaultContext)
}
