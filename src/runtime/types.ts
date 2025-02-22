export interface Flag<T = boolean> {
  value: T
  explanation?: {
    reason: 'STATIC' | 'TARGETING_MATCH' | 'DEFAULT'
    rule?: string
  }
}

export interface EvaluationContext {
  [key: string]: unknown
}

export type FlagDefinition =
  | boolean
  | ((context: EvaluationContext) => boolean)

export interface FeatureFlagsConfig {
  envKey?: string
  contextPath?: string
  flags?: Record<string, boolean>
  defaultContext?: Record<string, unknown>
}

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    featureFlags: FeatureFlagsConfig
  }
}
