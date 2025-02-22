import { useRuntimeConfig } from 'nitropack/runtime'

export function getFlags() {
  const runtimeConfig = useRuntimeConfig()
  return runtimeConfig.public?.featureFlags.flags || {}
}
