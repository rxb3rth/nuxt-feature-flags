import { useRuntimeConfig } from '#imports'
import { defineFeatureFlags } from '#feature-flags/handler'

export default defineFeatureFlags(() => {
  const runtimeConfig = useRuntimeConfig()

  // For inline flags, they're stored directly in featureFlags.flags
  // For config file flags, they're merged and available as the entire featureFlags object
  const flags = runtimeConfig.public.featureFlags?.flags || runtimeConfig.public.featureFlags || {}
  
  return flags
})
