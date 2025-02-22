import type { H3Event } from 'h3'
import { useRuntimeConfig } from 'nuxt/app'
import { defu } from 'defu'
import type { FlagDefinition, EvaluationContext, Flag } from './types'
import { evaluateFlag } from './utils'

export function evaluateFlags(
  definitions: Record<string, FlagDefinition>,
  context: EvaluationContext,
): Record<string, Flag> {
  const result: Record<string, Flag> = {}

  for (const [key, definition] of Object.entries(definitions)) {
    result[key] = evaluateFlag(definition, context)
  }

  return result
}

export async function getContext(event?: H3Event): Promise<EvaluationContext> {
  const runtimeConfig = useRuntimeConfig()

  const contextPath = runtimeConfig.public.featureFlags.contextPath
  const defaultContext = runtimeConfig.public.featureFlags.defaultContext || {}

  if (!contextPath) return defaultContext

  try {
    const contextModule = await import(contextPath).catch(() => ({}))
    const contextFn = contextModule.default || contextModule.context

    if (typeof contextFn !== 'function') {
      console.warn('Feature Flags: No valid context function found at', contextPath)
      return defaultContext
    }

    const context = await contextFn(event)
    return defu(context, defaultContext)
  }
  catch (error) {
    console.error('Feature Flags context error:', error)
    return defaultContext
  }
}
