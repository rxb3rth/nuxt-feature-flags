import type { H3Event } from 'h3'
import featureFlagConfig from '#feature-flags/config'
import type { FlagsSchema } from '#feature-flags'

export function getFeatureFlags(event: H3Event) {
  const flags = featureFlagConfig(event.context) as FlagsSchema

  return {
    flags,
    isEnabled(flagName: keyof FlagsSchema): boolean {
      return !!flags[flagName]
    },
  }
}
