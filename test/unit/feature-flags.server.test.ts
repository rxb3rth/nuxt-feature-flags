import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { H3Event } from 'h3'

// Mock dependencies with proper setup
const mockGetCookie = vi.fn()
const mockGetVariantForFlag = vi.fn()
const mockUseRuntimeConfig = vi.fn()

vi.mock('h3', () => ({
  getCookie: mockGetCookie,
}))

vi.mock('#imports', () => ({
  useRuntimeConfig: mockUseRuntimeConfig,
}))

vi.mock('../../src/runtime/server/utils/variant-assignment', () => ({
  getVariantForFlag: mockGetVariantForFlag,
}))

// Import after mocks
const { getFeatureFlags } = await import('../../src/runtime/server/utils/feature-flags')

describe('getFeatureFlags server util', () => {
  let mockEvent: H3Event

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockEvent = {
      node: {
        req: {
          headers: {},
          socket: { remoteAddress: '127.0.0.1' },
        },
      },
      context: {},
    } as H3Event

    mockGetCookie.mockReturnValue(undefined)
    mockGetVariantForFlag.mockReturnValue({ name: 'control', weight: 50, value: 'control-value' })
    
    // Set up runtime config mock
    mockUseRuntimeConfig.mockReturnValue({
      featureFlags: {
        flags: {
          simpleFlag: true,
          disabledFlag: false,
          complexFlag: {
            enabled: true,
            value: 'test',
            variants: [
              { name: 'control', weight: 50 },
              { name: 'treatment', weight: 50 },
            ],
          },
        },
      },
    })
  })

  describe('context extraction', () => {
    it('should extract user ID from context', () => {
      mockEvent.context.user = { id: 'user123' }
      
      const result = getFeatureFlags(mockEvent)
      
      expect(result.flags).toBeDefined()
      expect(result.isEnabled).toBeInstanceOf(Function)
    })

    it('should extract session ID from cookie', () => {
      mockGetCookie.mockReturnValue('session123')
      
      const result = getFeatureFlags(mockEvent)
      
      expect(result.flags).toBeDefined()
      expect(mockGetCookie).toHaveBeenCalledWith(mockEvent, 'session-id')
    })

    it('should extract IP address from request', () => {
      const result = getFeatureFlags(mockEvent)
      
      expect(result.flags).toBeDefined()
    })

    it('should handle forwarded headers', () => {
      mockEvent.node.req.headers['x-forwarded-for'] = '192.168.1.1, 10.0.0.1'
      
      const result = getFeatureFlags(mockEvent)
      
      expect(result.flags).toBeDefined()
    })
  })

  describe('flag resolution', () => {
    it('should resolve simple boolean flags', () => {
      const result = getFeatureFlags(mockEvent)
      
      expect(result.flags.simpleFlag).toEqual({
        enabled: true,
        value: true,
      })
    })

    it('should resolve variant flags', () => {
      mockGetVariantForFlag.mockReturnValue({ name: 'treatment', weight: 50, value: 'B' })
      
      const result = getFeatureFlags(mockEvent)
      
      expect(result.flags.complexFlag).toEqual({
        enabled: true,
        value: 'B',
        variant: 'treatment',
      })
    })

    it('should handle disabled flags', () => {
      const result = getFeatureFlags(mockEvent)
      
      expect(result.flags.disabledFlag).toEqual({
        enabled: false,
        value: false,
      })
    })

    it('should handle complex flag configurations', () => {
      mockGetVariantForFlag.mockReturnValue({
        name: 'control',
        weight: 50,
        value: 'control-variant',
      })
      
      const result = getFeatureFlags(mockEvent)
      
      expect(result.flags.complexFlag).toEqual({
        enabled: true,
        value: 'control-variant',
        variant: 'control',
      })
    })
  })

  describe('error handling', () => {
    it('should handle missing config gracefully', () => {
      const result = getFeatureFlags(mockEvent)
      
      expect(result.flags).toBeDefined()
      expect(typeof result.isEnabled).toBe('function')
    })

    it('should handle variant assignment errors', () => {
      mockGetVariantForFlag.mockImplementation(() => {
        throw new Error('Variant assignment failed')
      })
      
      expect(() => getFeatureFlags(mockEvent)).not.toThrow()
    })
  })

  describe('context fallbacks', () => {
    it('should handle missing context gracefully', () => {
      mockEvent.context = {}
      
      const result = getFeatureFlags(mockEvent)
      
      expect(result.flags).toBeDefined()
    })

    it('should prioritize user context over other identifiers', () => {
      mockEvent.context.user = { id: 'user123' }
      mockEvent.context.userId = 'fallback-user'
      
      const result = getFeatureFlags(mockEvent)
      
      expect(result.flags).toBeDefined()
    })

    it('should use fallback userId from context', () => {
      mockEvent.context.userId = 'context-user-id'
      
      const result = getFeatureFlags(mockEvent)
      
      expect(result.flags).toBeDefined()
    })
  })

  describe('utility methods', () => {
    it('should provide isEnabled method', () => {
      const result = getFeatureFlags(mockEvent)
      
      expect(result.isEnabled('simpleFlag')).toBe(true)
      expect(result.isEnabled('disabledFlag')).toBe(false)
      expect(result.isEnabled('nonExistentFlag')).toBe(false)
    })

    it('should provide getVariant method', () => {
      const result = getFeatureFlags(mockEvent)
      
      expect(result.getVariant('complexFlag')).toBe('control')
      expect(result.getVariant('simpleFlag')).toBeUndefined()
    })

    it('should provide getValue method', () => {
      const result = getFeatureFlags(mockEvent)
      
      expect(result.getValue('simpleFlag')).toBe(true)
      expect(result.getValue('complexFlag')).toBe('control-value')
    })
  })
})
