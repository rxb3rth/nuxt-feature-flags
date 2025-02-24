import type { H3Event, H3EventContext } from 'h3'
import { createJiti } from 'jiti'
import { useRuntimeConfig } from 'nitropack/runtime'
import type { Flag, FlagDefinition } from '../types'

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

export async function useServerFlags<T extends FlagDefinition>(event: H3Event) {
  const flags = await getFlags(event.context)

  return {
    flags,
    isEnabled(flagName: keyof T): boolean {
      return flags[flagName]?.value ?? false
    },
    get<V = boolean>(flagName: keyof T): Flag<V> | undefined {
      return flags[flagName] as Flag<V> | undefined
    },
  }
}
