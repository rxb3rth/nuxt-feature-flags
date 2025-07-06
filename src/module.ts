import { existsSync } from 'node:fs'
import { defu } from 'defu'
import { defineNuxtModule, createResolver, addImports, addPlugin, addTypeTemplate, addServerHandler, addServerImportsDir } from '@nuxt/kit'
import { loadConfig } from 'c12'
import type { FeatureFlagsConfig, FlagDefinition } from './runtime/types'
import { logger } from './runtime/logger'

declare module 'nuxt/schema' {
  interface PublicRuntimeConfig {
    featureFlags: FeatureFlagsConfig
  }
}

export default defineNuxtModule<FeatureFlagsConfig>({
  meta: {
    name: 'nuxt-feature-flags',
    compatibility: {
      nuxt: '>=3.1.0',
      bridge: false,
    },
    configKey: 'featureFlags',
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.public.featureFlags = defu(nuxt.options.runtimeConfig.public.featureFlags, options)

    nuxt.options.alias['#feature-flags/types'] = './types/nuxt-feature-flags.d.ts'
    nuxt.options.alias['#feature-flags/handler'] = resolver.resolve('./runtime/server/handlers/feature-flags')
    
    // Create default config that handles inline flags properly
    let configPath = resolver.resolve('./runtime/feature-flags.config')

    // Load feature flags configuration from file so that we can generated types from them
    if (options.config) {
      try {
        const { config: configFlags, configFile } = await loadConfig<FlagDefinition>({
          configFile: options.config.replace(/\.\w+$/, ''),
          cwd: nuxt.options.rootDir,
          jitiOptions: {
            interopDefault: true,
            moduleCache: true,
            alias: {
              '#feature-flags/handler': resolver.resolve('./runtime/server/handlers/feature-flags'),
            },
          },
        })

        if (!existsSync(configFile!)) {
          throw new Error(`${configFile} does not exist`)
        }

        options.flags = defu(options.flags, configFlags || {})
        configPath = configFile!
      }
      catch (error) {
        logger.error('Failed to load feature flags configuration:', error)
      }
    }
    
    nuxt.options.alias['#feature-flags/config'] = configPath

    addServerImportsDir(resolver.resolve('./runtime/server/utils'))
    addPlugin(resolver.resolve('./runtime/app/plugins/feature-flag.server'))
    addImports({
      name: 'useFeatureFlags',
      from: resolver.resolve('./runtime/app/composables/feature-flags'),
    })

    addServerHandler({
      handler: resolver.resolve('./runtime/server/api/feature-flags.get'),
      route: '/api/_feature-flags/feature-flags',
      method: 'get',
    })

    // Generate types from featureFlags config
    addTypeTemplate({
      filename: 'types/nuxt-feature-flags.d.ts',
      getContents: () => {
        const flags = options.flags || {}
        const flagEntries = Object.entries(flags)
          .map(([key, value]) => `  ${key}: ${typeof value}`)
          .join('\n')

        return `export interface FlagsSchema {
${flagEntries}
}`
      },
    })
  },
})
