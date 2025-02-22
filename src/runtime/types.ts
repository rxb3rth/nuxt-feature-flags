export interface Flag<T = boolean> {
  value: T
  explanation?: {
    reason: 'STATIC' | 'TARGETING_MATCH' | 'DEFAULT'
    rule?: string
  }
}

export type FlagDefinition = { [key: string]: boolean | number | string | null }

export type FeatureFlagsConfig = {
  flags?: FlagDefinition
}
