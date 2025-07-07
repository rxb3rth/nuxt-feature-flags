import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { ResolvedFlags } from '../../src/runtime/server/utils/feature-flags'

// Mock dependencies - define functions in scope where they won't cause hoisting issues
const mockFetch = vi.fn()
const mockState = vi.fn()

vi.mock('#imports', () => ({
  useRequestFetch: () => mockFetch,
  useState: () => mockState(),
}))

// Import after mocks are set up
const { useFeatureFlags } = await import('../../src/runtime/app/composables/feature-flags')

describe('useFeatureFlags composable', () => {
  let mockFlags: { value: ResolvedFlags }

  beforeEach(() => {
    mockFlags = {
      value: {},
    }
    mockState.mockReturnValue(mockFlags)
    mockFetch.mockClear()
    mockFetch.mockResolvedValue({ flags: {} })
  })

  describe('fetch', () => {
    it('should fetch and update flags state', async () => {
      const mockResponse = {
        flags: {
          testFlag: { enabled: true, value: true },
          variantFlag: { enabled: true, variant: 'variantA', value: 'A' },
        },
      }
      mockFetch.mockResolvedValue(mockResponse)

      const { fetch } = useFeatureFlags()
      await fetch()

      expect(mockFetch).toHaveBeenCalledWith('/api/_feature-flags/feature-flags', {
        headers: { accept: 'application/json' },
        retry: false,
      })
      expect(mockFlags.value).toEqual(mockResponse.flags)
    })

    it('should handle fetch errors gracefully', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      const { fetch } = useFeatureFlags()
      await fetch()

      expect(mockFlags.value).toEqual({})
    })

    it('should handle malformed response', async () => {
      mockFetch.mockResolvedValue(null)

      const { fetch } = useFeatureFlags()
      await fetch()

      expect(mockFlags.value).toEqual({})
    })
  })

  describe('isEnabled', () => {
    beforeEach(() => {
      mockFlags.value = {
        enabledFlag: { enabled: true, value: true },
        disabledFlag: { enabled: false, value: false },
        variantFlag: { enabled: true, variant: 'variantA', value: 'A' },
        numberFlag: { enabled: true, value: 42 },
      }
    })

    it('should return true for enabled flags', () => {
      const { isEnabled } = useFeatureFlags()
      expect(isEnabled('enabledFlag')).toBe(true)
    })

    it('should return false for disabled flags', () => {
      const { isEnabled } = useFeatureFlags()
      expect(isEnabled('disabledFlag')).toBe(false)
    })

    it('should return false for non-existent flags', () => {
      const { isEnabled } = useFeatureFlags()
      expect(isEnabled('nonExistentFlag')).toBe(false)
    })

    it('should handle variant syntax correctly', () => {
      const { isEnabled } = useFeatureFlags()
      
      // Correct variant
      expect(isEnabled('variantFlag:variantA')).toBe(true)
      
      // Wrong variant
      expect(isEnabled('variantFlag:variantB')).toBe(false)
      
      // No variant specified for variant flag
      expect(isEnabled('variantFlag')).toBe(true)
    })

    it('should handle flags without variants', () => {
      const { isEnabled } = useFeatureFlags()
      
      // Should return false when variant is specified for non-variant flag
      expect(isEnabled('enabledFlag:someVariant')).toBe(false)
    })
  })

  describe('getVariant', () => {
    beforeEach(() => {
      mockFlags.value = {
        variantFlag: { enabled: true, variant: 'variantA', value: 'A' },
        noVariantFlag: { enabled: true, value: true },
      }
    })

    it('should return variant for flags with variants', () => {
      const { getVariant } = useFeatureFlags()
      expect(getVariant('variantFlag')).toBe('variantA')
    })

    it('should return undefined for flags without variants', () => {
      const { getVariant } = useFeatureFlags()
      expect(getVariant('noVariantFlag')).toBeUndefined()
    })

    it('should return undefined for non-existent flags', () => {
      const { getVariant } = useFeatureFlags()
      expect(getVariant('nonExistentFlag')).toBeUndefined()
    })
  })

  describe('getValue', () => {
    beforeEach(() => {
      mockFlags.value = {
        booleanFlag: { enabled: true, value: true },
        stringFlag: { enabled: true, value: 'hello' },
        numberFlag: { enabled: true, value: 42 },
        objectFlag: { enabled: true, value: 'object-like-string' },
        noValueFlag: { enabled: true },
      }
    })

    it('should return flag values correctly', () => {
      const { getValue } = useFeatureFlags()
      
      expect(getValue('booleanFlag')).toBe(true)
      expect(getValue('stringFlag')).toBe('hello')
      expect(getValue('numberFlag')).toBe(42)
      expect(getValue('objectFlag')).toBe('object-like-string')
    })

    it('should return undefined for flags without values', () => {
      const { getValue } = useFeatureFlags()
      expect(getValue('noValueFlag')).toBeUndefined()
    })

    it('should return undefined for non-existent flags', () => {
      const { getValue } = useFeatureFlags()
      expect(getValue('nonExistentFlag')).toBeUndefined()
    })
  })

  describe('getFlag', () => {
    beforeEach(() => {
      mockFlags.value = {
        fullFlag: { enabled: true, variant: 'variantA', value: 'test' },
        simpleFlag: { enabled: false },
      }
    })

    it('should return complete flag objects', () => {
      const { getFlag } = useFeatureFlags()
      
      expect(getFlag('fullFlag')).toEqual({
        enabled: true,
        variant: 'variantA',
        value: 'test',
      })
      
      expect(getFlag('simpleFlag')).toEqual({
        enabled: false,
      })
    })

    it('should return undefined for non-existent flags', () => {
      const { getFlag } = useFeatureFlags()
      expect(getFlag('nonExistentFlag')).toBeUndefined()
    })
  })

  describe('reactive state', () => {
    it('should maintain reactive state reference', () => {
      const { flags } = useFeatureFlags()
      expect(flags).toBe(mockFlags)
    })

    it('should initialize with empty state', () => {
      mockState.mockReturnValue({ value: {} })
      const { flags } = useFeatureFlags()
      expect(flags.value).toEqual({})
    })
  })
})
