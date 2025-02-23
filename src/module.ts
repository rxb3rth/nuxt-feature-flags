import { defu } from 'defu'
import { defineNuxtModule, createResolver, addImports, addPlugin, addServerPlugin, addTypeTemplate } from '@nuxt/kit'
import type { FeatureFlagsConfig } from './runtime/types'
import { loadModuleConfig } from './runtime/utils'

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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      nuxt.options.runtimeConfig.public.featureFlags, options)

    const c = await loadModuleConfig(options, nuxt)
    console.log('Loaded config:', c)

    // TODO: Create template for the nitro plugin

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

    // Generate types from featureFlags config
    addTypeTemplate({
      filename: 'types/nuxt-feature-flags.d.ts',
      getContents: () => {
        const flags = options.flags || {}
        const flagEntries = Object.entries(flags)
          .map(([key, value]) => `  ${key}: ${typeof value}`)
          .join('\n')

        return `// Generated by nuxt-feature-flags
export interface FlagsSchema {
  [key: string]: boolean | string | number;
${flagEntries}
}`
      },
    })
  },
})
