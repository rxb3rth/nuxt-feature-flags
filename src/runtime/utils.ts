import type { FlagDefinition, EvaluationContext, Flag } from './types'

export function evaluateFlag(
  definition: FlagDefinition,
  context: EvaluationContext,
): Flag {
  let value = false
  const explanation: Flag['explanation'] = {
    reason: 'DEFAULT',
  }

  if (typeof definition === 'boolean') {
    value = definition
    explanation.reason = 'STATIC'
  }
  else if (typeof definition === 'function') {
    try {
      value = definition(context)
      explanation.reason = 'TARGETING_MATCH'
    }
    catch {
      value = false
    }
  }

  return { value, explanation }
}
