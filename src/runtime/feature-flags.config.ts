import { useRuntimeConfig } from '#imports'
import { defineFeatureFlags } from '#feature-flags/handler'

export default defineFeatureFlags(() => {
  const runtimeConfig = useRuntimeConfig()

  return runtimeConfig.public.featureFlags.flags || {}
})
