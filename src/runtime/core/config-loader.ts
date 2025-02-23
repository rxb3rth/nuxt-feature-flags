import { existsSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import type { Nuxt } from 'nuxt/schema'
import { resolve } from 'pathe'
import type { FeatureFlagsConfig } from '../types'
import { logger } from '../logger'

/**
 * Load and merge a custom configuration file for your module.
 *
 * Supports config files with the following extensions: .mjs, .cjs, .js
 *
 * @param moduleOptions - Options passed to your module.
 * @param nuxt - The Nuxt context.
 * @returns A merged configuration object.
 */
export async function loadModuleConfig(
  moduleOptions: FeatureFlagsConfig,
  nuxt: Nuxt,
) {
  // Define the list of supported extensions.
  const supportedExts = ['.mjs', '.cjs', '.js']

  // Resolve the config file path from moduleOptions if provided.
  // Otherwise, try to locate a default file named "feature-flags.config" with any supported extension.
  let configFilePath: string | undefined = moduleOptions.config
    ? resolve(nuxt.options.rootDir, moduleOptions.config)
    : undefined

  if (!configFilePath) {
    for (const ext of supportedExts) {
      const candidate = resolve(nuxt.options.rootDir, `feature-flags.config${ext}`)
      if (existsSync(candidate)) {
        configFilePath = candidate
        break
      }
    }
  }

  // If no config file is found, return the moduleOptions as is.
  if (!configFilePath || !existsSync(configFilePath)) {
    return { ...moduleOptions }
  }

  let customConfig = {} as FeatureFlagsConfig
  try {
    // Convert the absolute file path to a file URL for dynamic import.
    const fileUrl = pathToFileURL(configFilePath).href
    const importedModule = await import(fileUrl)
    // Use the default export if available; otherwise, use the module exports directly.
    customConfig = importedModule.default || importedModule
  }
  catch (error) {
    logger.error(`Error loading config file at ${configFilePath}:`, error)
  }

  return customConfig?.flags || customConfig || {}
}
