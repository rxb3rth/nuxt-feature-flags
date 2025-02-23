import type { FlagDefinition, Flag, FlagValue } from '../types'

export async function resolveFlags(definitions: FlagDefinition,
) {
  const result: Record<string, Flag> = {}

  for (const [key, definition] of Object.entries(definitions)) {
    result[key] = evaluateFlag(definition)
  }

  return result
}

export function evaluateFlag(
  value: FlagValue,
): Flag {
  const explanation: Flag['explanation'] = {
    reason: 'DEFAULT',
  }

  if (typeof value === 'boolean') {
    explanation.reason = 'STATIC'
  }
  else {
    value = false
  }

  return { value, explanation }
}
