import { useRequestFetch, useState } from '#imports'
import type { FlagsSchema } from '#build/types/nuxt-feature-flags'

export function useClientFlags() {
  const flags = useState<FlagsSchema>('feature-flags', () => ({}))

  const fetch = async () => {
    flags.value = await useRequestFetch()('/api/_feature-flags/feature-flags', {
      headers: {
        accept: 'application/json',
      },
      retry: false,
    }).catch(() => ({}))
  }

  return {
    fetch,
    flags,
    isEnabled(flagName: keyof FlagsSchema): boolean {
      return !!flags.value[flagName]
    },
  }
}
