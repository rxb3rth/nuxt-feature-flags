import { useState } from 'nuxt/app'
import type { FlagDefinition } from './types'

export function useClientFlags<T extends FlagDefinition>() {
  const flags = useState<T>('feature-flags')

  return {
    flags,
    isEnabled(flagName: keyof T): boolean {
      return !!flags.value[flagName]
    },
  }
}
