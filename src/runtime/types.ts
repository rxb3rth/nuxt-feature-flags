import type { H3EventContext } from 'h3'

export interface Flag<T = boolean> {
  value: T
  explanation?: {
    reason: 'STATIC' | 'TARGETING_MATCH' | 'DEFAULT'
    rule?: string
  }
}

export type FlagValue = boolean | number | string | null

export type FlagDefinition = { [key: string]: FlagValue }

export type FeatureFlagsConfig<T extends FlagDefinition = FlagDefinition> = {
  flags?: T
  config?: string
}

export declare function defineFeatureFlagsConfig(callback: (context: H3EventContext) => FlagDefinition): (context: H3EventContext) => FlagDefinition
