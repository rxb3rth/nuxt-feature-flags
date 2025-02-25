import { useState } from 'nuxt/app'
import type { FlagsSchema } from '#build/types/nuxt-feature-flags'

export function useClientFlags() {
  const flags = useState<FlagsSchema>('feature-flags')

  return {
    flags,
    isEnabled(flagName: keyof FlagsSchema): boolean {
      return !!flags.value[flagName]
    },
  }
}
