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

    nuxt.options.nitro = nuxt.options.nitro || {}
    nuxt.options.nitro.imports = nuxt.options.nitro.imports || {}
    nuxt.options.nitro.imports.presets = nuxt.options.nitro.imports.presets || []
    nuxt.options.nitro.imports.presets.push({
      from: resolver.resolve('./runtime/server/composables'),
      imports: ['useServerFlags'],
    })

    addPlugin({
      src: resolver.resolve('./runtime/plugin'),
    })

    addServerPlugin(resolver.resolve('./runtime/server/plugin'))

    addImports({
      name: 'useClientFlags',
      from: resolver.resolve('./runtime/composables'),
    })
  },
})
