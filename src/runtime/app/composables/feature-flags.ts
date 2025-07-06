import { useRequestFetch, useState } from '#imports'
import type { FlagsSchema } from '#feature-flags/types'

export function useFeatureFlags() {
  const flags = useState<FlagsSchema>('feature-flags', () => ({}))

  const fetch = async () => {
    const response = await useRequestFetch()('/api/_feature-flags/feature-flags', {
      headers: {
        accept: 'application/json',
      },
      retry: false,
    }).catch(() => ({ flags: {} }))

    flags.value = response.flags || {}
  }

  return {
    fetch,
    flags,
    isEnabled(flagName: keyof FlagsSchema): boolean {
      return !!flags.value[flagName]
    },
  }
}
