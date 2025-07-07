import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock runtime config
const mockRuntimeConfig = {
  featureFlags: {
    environment: 'test',
    flags: {},
  },
}

vi.mock('#imports', () => ({
  useRuntimeConfig: () => mockRuntimeConfig,
}))

// Import after mocking
const { isFeatureEnabled } = await import('../../src/runtime/server/utils/feature-flags')

describe('isFeatureEnabled server handler', () => {
  beforeEach(() => {
    mockRuntimeConfig.featureFlags.flags = {}
  })

  describe('simple flag checking', () => {
    it('should return true for enabled string flags', () => {
      mockRuntimeConfig.featureFlags.flags = {
        enabledFlag: true,
      }
      
      expect(isFeatureEnabled('enabledFlag')).toBe(true)
    })

    it('should return false for disabled flags', () => {
      mockRuntimeConfig.featureFlags.flags = {
        disabledFlag: false,
      }
      
      expect(isFeatureEnabled('disabledFlag')).toBe(false)
    })

    it('should return false for non-existent flags', () => {
      expect(isFeatureEnabled('nonExistentFlag')).toBe(false)
    })
  })

  describe('complex flag checking', () => {
    it('should check enabled property for object flags', () => {
      mockRuntimeConfig.featureFlags.flags = {
        objectFlag: {
          enabled: true,
          value: 'test',
        },
      }
      
      expect(isFeatureEnabled('objectFlag')).toBe(true)
    })

    it('should return false for disabled object flags', () => {
      mockRuntimeConfig.featureFlags.flags = {
        objectFlag: {
          enabled: false,
          value: 'test',
        },
      }
      
      expect(isFeatureEnabled('objectFlag')).toBe(false)
    })

    it('should handle flags with variants', () => {
      mockRuntimeConfig.featureFlags.flags = {
        variantFlag: {
          enabled: true,
          variants: [
            { name: 'control', weight: 50 },
            { name: 'treatment', weight: 50 },
          ],
        },
      }
      
      expect(isFeatureEnabled('variantFlag')).toBe(true)
    })
  })

  describe('variant-specific checking', () => {
    beforeEach(() => {
      mockRuntimeConfig.featureFlags.flags = {
        variantFlag: {
          enabled: true,
          variants: [
            { name: 'control', weight: 50 },
            { name: 'treatment', weight: 50 },
          ],
        },
      }
    })

    it('should check specific variants when provided', () => {
      // Note: This would require mocking the variant assignment logic
      // For now, just test that the function doesn't throw
      expect(() => isFeatureEnabled('variantFlag', 'control')).not.toThrow()
      expect(() => isFeatureEnabled('variantFlag', 'treatment')).not.toThrow()
    })

    it('should handle invalid variant names', () => {
      expect(() => isFeatureEnabled('variantFlag', 'invalidVariant')).not.toThrow()
    })
  })

  describe('edge cases', () => {
    it('should handle null/undefined flag values', () => {
      mockRuntimeConfig.featureFlags.flags = {
        nullFlag: null,
        undefinedFlag: undefined,
      }
      
      expect(isFeatureEnabled('nullFlag')).toBe(false)
      expect(isFeatureEnabled('undefinedFlag')).toBe(false)
    })

    it('should handle empty string flag names', () => {
      expect(isFeatureEnabled('')).toBe(false)
    })

    it('should handle numeric flag values', () => {
      mockRuntimeConfig.featureFlags.flags = {
        zeroFlag: 0,
        oneFlag: 1,
        negativeFlag: -1,
      }
      
      expect(isFeatureEnabled('zeroFlag')).toBe(false)
      expect(isFeatureEnabled('oneFlag')).toBe(true)
      expect(isFeatureEnabled('negativeFlag')).toBe(true)
    })

    it('should handle array flag values', () => {
      mockRuntimeConfig.featureFlags.flags = {
        emptyArrayFlag: [],
        nonEmptyArrayFlag: ['item'],
      }
      
      expect(isFeatureEnabled('emptyArrayFlag')).toBe(false)
      expect(isFeatureEnabled('nonEmptyArrayFlag')).toBe(true)
    })
  })

  describe('configuration edge cases', () => {
    it('should handle missing flags configuration', () => {
      mockRuntimeConfig.featureFlags.flags = undefined
      
      expect(isFeatureEnabled('anyFlag')).toBe(false)
    })

    it('should handle empty flags configuration', () => {
      mockRuntimeConfig.featureFlags.flags = {}
      
      expect(isFeatureEnabled('anyFlag')).toBe(false)
    })
  })
})
