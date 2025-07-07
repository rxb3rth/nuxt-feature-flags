import type { FeatureFlagsConfig } from './feature-flags'

export interface ServerFunctions {
  getFeatureFlagsConfig: () => FeatureFlagsConfig
  getFeatureFlagsStatus: () => Promise<{
    totalFlags: number
    enabledFlags: number
  }>
  toggleFlag: (flagName: string) => Promise<boolean>
}

export interface ClientFunctions {
  showNotification?: (message: string) => void
  refreshFlags?: () => void
}
