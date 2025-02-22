import defu from 'defu'
import type { H3EventContext } from 'h3'
import type { FlagDefinition, Flag } from './types'

export function getFlags(
  definitions: Record<string, FlagDefinition>,
  serverContext?: H3EventContext,
): Record<string, Flag> {
  const result: Record<string, Flag> = {}
  const flags = defu(definitions, serverContext?.featureFlagsConfig?.flags || {})

  for (const [key, definition] of Object.entries(flags)) {
    result[key] = evaluateFlag(definition)
  }

  return result
}

export function evaluateFlag(
  definition: FlagDefinition,
): Flag {
  let value = false
  const explanation: Flag['explanation'] = {
    reason: 'DEFAULT',
  }

  if (typeof definition === 'boolean') {
    value = definition
    explanation.reason = 'STATIC'
  }

  return { value, explanation }
}
