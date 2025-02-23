import { useState } from 'nuxt/app'
import type { Flag, FlagDefinition } from './types'

export function useClientFlags<T extends FlagDefinition>() {
  const flags = useState<Record<keyof T, Flag>>('feature-flags', () => {
    return {} as Record<keyof T, Flag>
  })

  return {
    flags,
    isEnabled(flagName: keyof T): boolean {
      return flags.value[flagName]?.value ?? false
    },
    get<V = boolean>(flagName: keyof T): Flag<V> | undefined {
      return flags.value[flagName] as Flag<V> | undefined
    },
  }
}
