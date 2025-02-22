export interface Flag<T = boolean> {
  value: T
  explanation?: {
    reason: 'STATIC' | 'TARGETING_MATCH' | 'DEFAULT'
    rule?: string
  }
}

export interface EvaluationContext {
  flags?: Record<string, FlagDefinition>
  [key: string]: unknown
}

export type FlagDefinition = boolean | EvaluationContext

export interface FeatureFlagsConfig {
  envKey?: string
  flags?: Record<string, boolean>
  context?: string | EvaluationContext
  defaultContext?: Record<string, unknown>
}

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    featureFlags: FeatureFlagsConfig
  }
}
