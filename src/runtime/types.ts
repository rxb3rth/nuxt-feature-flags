export interface Flag<T = boolean> {
  value: T
  explanation?: {
    reason: 'STATIC' | 'TARGETING_MATCH' | 'DEFAULT'
    rule?: string
  }
}

export type FlagValue = boolean | number | string | null

export type FlagDefinition = { [key: string]: FlagValue }

export type FeatureFlagsConfig = {
  flags?: FlagDefinition
  config?: string
}
