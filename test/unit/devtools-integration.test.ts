import { describe, it, expect, vi } from 'vitest'
import { setupDevToolsIntegration } from '../../src/devtools'
import type { FeatureFlagsConfig } from '../../src/types'

// Mock Nuxt and DevTools kit
vi.mock('@nuxt/devtools-kit', () => ({
  addCustomTab: vi.fn(),
  extendServerRpc: vi.fn(),
  onDevToolsInitialized: vi.fn(callback => callback()),
}))

vi.mock('@nuxt/kit', () => ({
  createResolver: vi.fn(() => ({ resolve: vi.fn(path => path) })),
}))

describe('DevTools Integration', () => {
  it('should setup DevTools integration with proper configuration', () => {
    const mockConfig: FeatureFlagsConfig = {
      flags: {
        testFlag: true,
        complexFlag: {
          enabled: true,
          value: 'test',
          variants: {
            control: { weight: 50, value: 'control' },
            treatment: { weight: 50, value: 'treatment' },
          },
        },
      },
    }

    const mockNuxt = {
      options: {},
      hooks: { hook: vi.fn() },
      hook: vi.fn(),
    } as any

    // Should not throw when setting up DevTools integration
    expect(() => {
      setupDevToolsIntegration(mockConfig, mockNuxt)
    }).not.toThrow()
  })

  it('should handle empty flag configuration', () => {
    const mockConfig: FeatureFlagsConfig = {
      flags: {},
    }

    const mockNuxt = {
      options: {},
      hooks: { hook: vi.fn() },
      hook: vi.fn(),
    } as any

    expect(() => {
      setupDevToolsIntegration(mockConfig, mockNuxt)
    }).not.toThrow()
  })

  it('should handle undefined flags configuration', () => {
    const mockConfig: FeatureFlagsConfig = {}

    const mockNuxt = {
      options: {},
      hooks: { hook: vi.fn() },
      hook: vi.fn(),
    } as any

    expect(() => {
      setupDevToolsIntegration(mockConfig, mockNuxt)
    }).not.toThrow()
  })
})
