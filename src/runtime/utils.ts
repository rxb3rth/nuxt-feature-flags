export async function resolveFeatureFlagFile(filename: string) {
  if (filename) {
    try {
      const config = await import(filename)
      const definitionsFromFile = config.default || config
      return definitionsFromFile?.flags || {}
    }
    catch (error) {
      console.error('Failed to load feature flags from config file', error)
      return null
    }
  }
}
