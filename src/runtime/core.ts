import type { FlagDefinition, Flag } from './types'

export function resolveFlags(
  definitions: FlagDefinition,
): Record<string, Flag> {
  const result: Record<string, Flag> = {}

  for (const definitionKey in definitions) {
    const definition = definitions[definitionKey]
    const flag = evaluateFlag(definition)
    result[definitionKey] = flag
  }
  return result
}

export function evaluateFlag(
  value: boolean = false,
): Flag {
  const explanation: Flag['explanation'] = {
    reason: 'DEFAULT',
  }

  if (typeof value === 'boolean') {
    explanation.reason = 'STATIC'
  }

  return { value, explanation }
}
