import type { H3EventContext } from 'h3'
import type { FlagDefinition } from '../../types'

export function defineFeatureFlags(callback: (context?: H3EventContext) => FlagDefinition) {
  return callback
}
