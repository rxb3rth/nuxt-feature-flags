import { loadConfig } from 'c12'

import type { FlagDefinition } from '../types'
import { consolador } from '../logger'

export async function loadConfigFile(configPath: string, cwd: string) {
  try {
    return loadConfig<FlagDefinition>({ configFile: configPath.replace(/\.\w+$/, ''), cwd })
  }
  catch (error) {
    consolador.error('Failed to load config file:', error)
    return {
      config: {},
      configFile: configPath,
    }
  }
}
