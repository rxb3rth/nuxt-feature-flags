import { loadConfig } from 'c12'

import type { FlagDefinition } from '../types'
import { consolador } from '../logger'

export async function loadConfigFile(configPath: string, cwd: string) {
  try {
    const configFile = configPath.replace(/\.\w+$/, '')
    const { config } = await loadConfig<FlagDefinition>({ configFile, cwd })
    return config
  }
  catch (error) {
    consolador.error('Failed to load config file:', error)
    return {}
  }
}
