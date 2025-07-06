import type { H3Event } from 'h3'
import featureFlagConfig from '#feature-flags/config'
import type { FlagsSchema } from '#feature-flags/types'

export function getFeatureFlags(event: H3Event) {
  // Handle both function-based configs and static configs
  let flags: FlagsSchema

  if (typeof featureFlagConfig === 'function') {
    // Config file with defineFeatureFlags
    flags = featureFlagConfig(event.context) as FlagsSchema || {}
  }
  else {
    // Static config or inline flags
    flags = featureFlagConfig as FlagsSchema || {}
  }

  return {
    flags,
    isEnabled(flagName: keyof FlagsSchema): boolean {
      return !!flags[flagName]
    },
  }
}
