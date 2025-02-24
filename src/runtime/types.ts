export type Flag<T = boolean> = T

export type FlagValue = boolean | number | string | null

export type FlagDefinition = Record<string, FlagValue>

export type FlagResolved<T extends FlagDefinition = FlagDefinition> = Record<keyof T, Flag>

export type FeatureFlagsConfig<T extends FlagDefinition = FlagDefinition> = {
  flags?: T
  config?: string
}
