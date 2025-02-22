import { defu } from 'defu'
import { defineNuxtModule, createResolver, addImports, addPlugin, addServerPlugin } from '@nuxt/kit'
import type { FeatureFlagsConfig } from './runtime/types'
import { resolveFeatureFlagFile } from './runtime/utils'

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

    const resolveConfig = async () => {
      const { config, flags, inherit } = nuxt.options.runtimeConfig.public.featureFlags
      if ((config && typeof config === 'string')) {
        const definitions = await resolveFeatureFlagFile(config)

        const hasFileDefinitionSchema = definitions && Object.keys(definitions).length > 0
        const hasConfigDefinitionSchema = flags && Object.keys(flags).length > 0

        if (hasFileDefinitionSchema && hasConfigDefinitionSchema && inherit) {
          nuxt.options.runtimeConfig.public.featureFlags.flags = defu(flags, definitions)
        }
        else if (hasFileDefinitionSchema) {
          nuxt.options.runtimeConfig.public.featureFlags.flags = definitions
        }
        else {
          nuxt.options.runtimeConfig.public.featureFlags.flags = flags
        }
      }
    }

    nuxt.hook('modules:done', async () => {
      await resolveConfig()
    })
  },
})
