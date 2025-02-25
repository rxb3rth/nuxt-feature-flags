import type { H3Event, H3EventContext } from 'h3'
import { createJiti } from 'jiti'
import { useRuntimeConfig } from 'nitropack/runtime'
import type { FlagDefinition } from '../types'
import type { FlagsSchema } from '#build/types/nuxt-feature-flags'

async function getFlags(context?: H3EventContext) {
  const runtimeConfig = useRuntimeConfig()

  if (!runtimeConfig._feature_flags_config_path) {
    return context?.public?.featureFlags?.flags || {}
  }

  try {
    const jiti = createJiti(runtimeConfig._feature_flags_config_path, {
      interopDefault: true,
      moduleCache: true,
    })
    const configFn = await jiti.import<(context?: H3EventContext) => FlagDefinition>(runtimeConfig._feature_flags_config_path, { default: true })
    return configFn(context)
  }
  catch (error) {
    console.error('Error loading config file', error)
    return {}
  }
}

export async function useServerFlags(event: H3Event) {
  const flags = await getFlags(event.context) as FlagsSchema

  return {
    flags,
    isEnabled(flagName: keyof FlagsSchema): boolean {
      return !!flags[flagName]
    },
  }
}
