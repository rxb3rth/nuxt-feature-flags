import { useState } from 'nuxt/app'
import type { Flag } from './types'

export function useClientFlags() {
  const flags = useState<Record<string, Flag>>('feature-flags', () => ({}))

  return {
    flags,
    isEnabled(flagName: string): boolean {
      return flags.value[flagName]?.value ?? false
    },
    get<T = boolean>(flagName: string): Flag<T> | undefined {
      return flags.value[flagName] as Flag<T> | undefined
    },
  }
}
