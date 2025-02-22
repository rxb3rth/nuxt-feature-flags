import { resolveAlias } from '@nuxt/kit'

export async function resolveFeatureFlagFile(filename: string) {
  if (filename) {
    try {
      const url = resolveAlias(filename)
      const config = await import(url)
      const definitionsFromFile = config.default || config
      return definitionsFromFile?.flags || {}
    }
    catch (error) {
      console.error('Failed to load feature flags from config file', error)
      return null
    }
  }
}
