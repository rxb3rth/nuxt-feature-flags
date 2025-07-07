import { existsSync } from 'node:fs'
import { defu } from 'defu'
import { defineNuxtModule, createResolver, addImports, addPlugin, addTypeTemplate, addServerHandler, addServerImportsDir } from '@nuxt/kit'
import { loadConfig } from 'c12'
import type { FeatureFlagsConfig, FlagDefinition } from './types'
import { logger } from './utils/logger'

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

        // Handle both direct flag definitions and function-based definitions
        let resolvedFlags = configFlags
        if (typeof configFlags === 'function') {
          // Call the function to get the actual flags (for defineFeatureFlags usage)
          resolvedFlags = (configFlags as () => FlagDefinition)()
        }

        options.flags = defu(options.flags, resolvedFlags || {})
        configPath = configFile!
      }
      catch (error) {
        logger.error('Failed to load feature flags configuration:', error)
      }
    }

    // Set runtime config after loading flags
    nuxt.options.runtimeConfig.public.featureFlags = defu(nuxt.options.runtimeConfig.public.featureFlags, options)

    nuxt.options.alias['#feature-flags/config'] = configPath

    addServerImportsDir(resolver.resolve('./runtime/server/utils'))
    addPlugin(resolver.resolve('./runtime/app/plugins/feature-flag.server'))
    addPlugin(resolver.resolve('./runtime/app/plugins/feature-flag.client'))
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
          .map(([key, value]) => {
            // For simple flags, use the actual type
            if (typeof value !== 'object' || value === null || Array.isArray(value)) {
              return `  ${key}: ${typeof value}`
            }

            // For flag configs with variants, we still resolve to the base type
            // The variant logic is handled at runtime
            const flagConfig = value as { enabled?: boolean, value?: unknown }
            if (flagConfig.enabled !== undefined) {
              const valueType = flagConfig.value !== undefined ? typeof flagConfig.value : 'boolean'
              return `  ${key}: ${valueType}`
            }

            return `  ${key}: ${typeof value}`
          })
          .join('\n')

        return `export interface FlagsSchema {
${flagEntries}
}

// Type for resolved flag with variant info
export interface ResolvedFlag {
  enabled: boolean
  value?: boolean | number | string | null
  variant?: string
}

export interface ResolvedFlags {
  [key: string]: ResolvedFlag
}`
      },
    })
  },
})
