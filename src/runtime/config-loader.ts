import { existsSync } from 'node:fs'
import { loadConfig } from 'c12'

import type { FlagDefinition } from './types'
import { consolador } from './logger'

export async function loadConfigFile(configPath: string, cwd: string) {
  try {
    const config = await loadConfig<FlagDefinition>({ configFile: configPath.replace(/\.\w+$/, ''), cwd })

    if (!existsSync(config.configFile!)) {
      throw new Error(`${config.configFile} does not exist`)
    }

    return config
  }
  catch (error) {
    consolador.error('Failed to load config file:', error)
    return {
      config: {},
      configFile: configPath,
    }
  }
}
