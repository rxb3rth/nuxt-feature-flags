import type { RuntimeConfig } from '@nuxt/schema'
import type { H3EventContext } from 'h3'
import type { FlagDefinition, FlagResolved } from '../types'

export function getFlags(runtimeConfig: RuntimeConfig, context?: H3EventContext) {
  return (context?.public?.featureFlags?.flags || runtimeConfig.public?.featureFlags?.flags || {}) as FlagDefinition
}

export async function resolveFlags(definitions: FlagDefinition,
) {
  const result: FlagResolved = {}

  for (const [key, definition] of Object.entries(definitions)) {
    result[key] = !!definition
  }

  return result
}
