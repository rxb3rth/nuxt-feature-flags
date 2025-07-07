import type { ResolvedFlags } from '../../server/utils/feature-flags'
import { useRequestFetch, useState } from '#imports'
import type { FlagsSchema } from '#feature-flags/types'

export function useFeatureFlags() {
  const flags = useState<ResolvedFlags>('feature-flags', () => ({}))

  const fetch = async () => {
    const response = await useRequestFetch()('/api/_feature-flags/feature-flags', {
      headers: {
        accept: 'application/json',
      },
      retry: false,
    }).catch(() => ({ flags: {} }))

    flags.value = (response && typeof response === 'object' && 'flags' in response) ? (response.flags as ResolvedFlags) : {}
  }

  return {
    fetch,
    flags,

    /**
     * Check if a feature flag is enabled
     * @param flagName - The flag name, optionally with variant (e.g., 'myFlag:variantA')
     */
    isEnabled(flagName: keyof FlagsSchema | string): boolean {
      // Handle variant syntax: 'flagName:variantName'
      const [baseFlagName, targetVariant] = flagName.toString().split(':')
      const flag = flags.value[baseFlagName]

      if (!flag?.enabled) return false

      // If variant is specified, check if it matches
      if (targetVariant && flag.variant !== targetVariant) return false

      return true
    },

    /**
     * Get the assigned variant for a flag
     */
    getVariant(flagName: keyof FlagsSchema): string | undefined {
      return flags.value[flagName.toString()]?.variant
    },

    /**
     * Get the value for a flag
     */
    getValue(flagName: keyof FlagsSchema) {
      return flags.value[flagName.toString()]?.value
    },

    /**
     * Get flag with all details
     */
    getFlag(flagName: keyof FlagsSchema) {
      return flags.value[flagName.toString()]
    },
  }
}
