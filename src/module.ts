import { defineNuxtModule, createResolver, addImports, addPlugin, addServerPlugin, resolveAlias } from '@nuxt/kit'
import { defu } from 'defu'
import type { FeatureFlagsConfig, Flag } from './runtime/types'

const cache = new Map<string, Record<string, Flag>>()

async function resolveDefinitions(featureFlagsConfig: FeatureFlagsConfig) {
  if (featureFlagsConfig.inherit && featureFlagsConfig.config) {
    try {
      const url = resolveAlias(featureFlagsConfig.config)
      const configFn = await import(url)
      const definitionsFromFile = configFn.default()

      const cacheKey = JSON.stringify(definitionsFromFile)
      if (cache.has(cacheKey)) {
        return cache.get(cacheKey)
      }

      return definitionsFromFile
    }
    catch (error) {
      console.error('Failed to load feature flags from config file', error)
    }
  }
}

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
    inherit: false,
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.public.featureFlags = defu(
      nuxt.options.runtimeConfig.public.featureFlags, options)

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

    addImports({
      name: 'defineFlagsConfig',
      from: resolver.resolve('./runtime/core/define-config'),
    })

    nuxt.hook('modules:done', async () => {
      const { config, inherit } = nuxt.options.runtimeConfig.public.featureFlags
      if ((config && typeof config === 'string') && inherit) {
        const definitions = await resolveDefinitions(nuxt.options.runtimeConfig.public.featureFlags)
        nuxt.options.runtimeConfig.public.featureFlags.flags = defu(
          nuxt.options.runtimeConfig.public.featureFlags.flags, definitions)
      }
    })
  },
})
