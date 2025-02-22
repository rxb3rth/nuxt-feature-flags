import { defu } from 'defu'
import { defineNuxtModule, createResolver, addImports, addPlugin, addServerPlugin } from '@nuxt/kit'
import type { FlagDefinition } from './runtime/types'
import { logger } from './runtime/logger'
import { loadConfigFile } from './runtime/core/config-loader'

export interface ModuleOptions {
  flags?: FlagDefinition
  configFile?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-feature-flags',
    compatibility: {
      nuxt: '>=3.6.1',
      bridge: false,
    },
    configKey: 'featureFlags',
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    if (options.configFile) {
      try {
        logger.info('Loading feature flags from:', options.configFile)
        const configFlags = await loadConfigFile(options.configFile, nuxt.options.rootDir)
        logger.info('Loaded feature flags:', configFlags)
        options.flags = defu(options.flags, configFlags || {})
      }
      catch (error) {
        logger.error('Failed to load feature flags configuration:', error)
      }
    }

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
  },
})
