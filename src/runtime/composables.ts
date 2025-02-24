import { useState } from 'nuxt/app'
import type { FlagDefinition, FlagResolved } from './types'

export function useClientFlags<T extends FlagDefinition>() {
  const flags = useState<FlagResolved<T>>('feature-flags')

  return {
    flags,
    isEnabled(flagName: keyof FlagResolved<T>): boolean {
      return flags.value[flagName]
    },
  }
}
