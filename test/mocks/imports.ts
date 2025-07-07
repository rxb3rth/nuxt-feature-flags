// Mock for #imports
export const useRequestFetch = () => () => Promise.resolve({ flags: {} })
export const useState = (key: string, defaultFactory: () => any) => {
  return {
    value: defaultFactory(),
  }
}

export const useRuntimeConfig = () => ({
  public: {
    featureFlags: {},
  },
})

export const useFeatureFlags = () => ({
  flags: { value: {} },
  isEnabled: () => false,
  getVariant: () => undefined,
  getValue: () => undefined,
  getFlag: () => undefined,
  fetch: () => Promise.resolve(),
})
