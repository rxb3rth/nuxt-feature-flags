import { defineNuxtModule, createResolver, addImports, addPlugin, addServerPlugin } from '@nuxt/kit'
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
  defaults: {},
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.public.featureFlags = defu(
      nuxt.options.runtimeConfig.public.featureFlags, options as FeatureFlagsConfig)

    addPlugin({
      src: resolver.resolve('./runtime/plugin'),
    })

    addServerPlugin(resolver.resolve('./runtime/server/plugin'))

    addImports({
      name: 'useFeatureFlags',
      from: resolver.resolve('./runtime/composables'),
    })
  },
})
