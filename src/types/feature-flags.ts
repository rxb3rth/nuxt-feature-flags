export type Flag<T = boolean> = T

export type FlagValue = boolean | number | string | null

// Variant configuration for A/B/n testing
export interface FlagVariant {
  name: string
  weight: number // Distribution weight (0-100)
  value?: FlagValue // Optional value override for this variant
}

// Feature flag configuration with optional variants
export interface FlagConfig {
  enabled: boolean
  value?: FlagValue
  variants?: FlagVariant[]
}

export type FlagDefinition = Record<string, FlagValue | FlagConfig>

export type FlagResolved<T extends FlagDefinition = FlagDefinition> = Record<keyof T, Flag>

// Context for user/session identification for persistent variant assignment
export interface VariantContext {
  userId?: string
  sessionId?: string
  ipAddress?: string
}

export type FeatureFlagsConfig<T extends FlagDefinition = FlagDefinition> = {
  flags?: T
  config?: string
}
