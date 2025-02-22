import { defineNuxtModule, createResolver, addImports, addPlugin } from '@nuxt/kit'
import { defu } from 'defu'
import type { FeatureFlagsConfig } from './runtime/types'

export default defineNuxtModule<FeatureFlagsConfig>({
  meta: {
    name: 'nuxt-feature-flags',
    compatibility: {
      nuxt: '>=3.6.1',
      bridge: false,
    },
    configKey: 'featureFlags',
  },
  defaults: {
    envKey: 'NUXT_PUBLIC_FEATURE_FLAGS',
    flags: {},
    contextPath: '~/feature-flags.context',
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.public.featureFlags = defu(
      nuxt.options.runtimeConfig.public.featureFlags,
      {
        envKey: options.envKey,
        defaultContext: options.defaultContext,
        flags: options.flags,
        contextPath: options.contextPath,
      },
    ) as FeatureFlagsConfig

    addImports({
      name: 'useFeatureFlags',
      from: resolver.resolve('./runtime/composables'),
    })

    addPlugin({
      src: resolver.resolve('./runtime/plugin'),
    })
  },
})
