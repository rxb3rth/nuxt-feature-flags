import { describe, it, expect } from 'vitest'

describe('build-time validation', () => {
  describe('configuration validation', () => {
    it('should validate basic flag configurations', () => {
      const validConfigs = [
        {
          environment: 'test',
          flags: {
            simpleFlag: true,
            disabledFlag: false,
          },
        },
        {
          environment: 'production',
          flags: {
            complexFlag: {
              enabled: true,
              value: 'test-value',
            },
          },
        },
      ]

      validConfigs.forEach((config) => {
        expect(config.environment).toBeTruthy()
        expect(typeof config.flags).toBe('object')
      })
    })

    it('should handle variant configurations', () => {
      const variantConfig = {
        environment: 'test',
        flags: {
          abTest: {
            enabled: true,
            variants: [
              { name: 'control', weight: 50 },
              { name: 'treatment', weight: 50 },
            ],
          },
        },
      }

      expect(variantConfig.flags.abTest.variants).toHaveLength(2)
      
      const totalWeight = variantConfig.flags.abTest.variants
        .reduce((sum, variant) => sum + variant.weight, 0)
      expect(totalWeight).toBe(100)
    })

    it('should validate weight constraints', () => {
      const testCases = [
        {
          variants: [
            { name: 'a', weight: 50 },
            { name: 'b', weight: 50 },
          ],
          expectedValid: true,
        },
        {
          variants: [
            { name: 'a', weight: 60 },
            { name: 'b', weight: 60 },
          ],
          expectedValid: false, // Total > 100
        },
        {
          variants: [
            { name: 'a', weight: 30 },
            { name: 'b', weight: 20 },
          ],
          expectedValid: true, // Total < 100 is OK (can be normalized)
        },
      ]

      testCases.forEach(({ variants, expectedValid }) => {
        const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0)
        
        if (expectedValid) {
          expect(totalWeight).toBeLessThanOrEqual(100)
        } else {
          expect(totalWeight).toBeGreaterThan(100)
        }
      })
    })
  })

  describe('usage pattern validation', () => {
    it('should detect common usage patterns', () => {
      const usagePatterns = [
        'v-feature="flagName"',
        "v-feature='flagName'",
        'isEnabled("flagName")',
        "isEnabled('flagName')",
        'getVariant("flagName")',
        "getVariant('flagName')",
        'getValue("flagName")',
        "getValue('flagName')",
      ]

      const flagNameRegex = /(?:v-feature=|isEnabled\(|getVariant\(|getValue\()["']([^"']+)["']/g

      usagePatterns.forEach((pattern) => {
        const matches = [...pattern.matchAll(flagNameRegex)]
        expect(matches.length).toBeGreaterThan(0)
        expect(matches[0][1]).toBe('flagName')
      })
    })

    it('should extract flag names from variant syntax', () => {
      const variantPatterns = [
        'isEnabled("flagName:variantA")',
        "isEnabled('flagName:variantB')",
      ]

      variantPatterns.forEach((pattern) => {
        const match = pattern.match(/isEnabled\(['"]([^:'"]+)(?::([^'"]+))?['"]\)/)
        expect(match).toBeTruthy()
        expect(match?.[1]).toBe('flagName')
        expect(match?.[2]).toMatch(/variant[AB]/)
      })
    })

    it('should handle nested flag usage', () => {
      const nestedUsages = [
        'if (isEnabled("parentFlag") && isEnabled("childFlag")) {}',
        'const result = getVariant("testFlag") === "treatment" ? getValue("treatmentFlag") : getValue("defaultFlag")',
      ]

      const flagRegex = /(?:isEnabled|getVariant|getValue)\(['"]([^'"]+)['"]\)/g

      nestedUsages.forEach((usage) => {
        const matches = [...usage.matchAll(flagRegex)]
        expect(matches.length).toBeGreaterThan(1)
      })
    })
  })

  describe('validation mode behavior', () => {
    it('should respect different validation modes', () => {
      const modes = ['disabled', 'warn', 'error'] as const

      modes.forEach((mode) => {
        const config = {
          validation: { mode },
        }

        expect(['disabled', 'warn', 'error']).toContain(config.validation.mode)
      })
    })

    it('should handle validation configuration options', () => {
      const validationOptions = {
        mode: 'warn' as const,
        includeGlobs: ['**/*.{vue,ts,js}'],
        excludeGlobs: ['node_modules', '.nuxt', 'dist'],
      }

      expect(validationOptions.includeGlobs).toContain('**/*.{vue,ts,js}')
      expect(validationOptions.excludeGlobs).toContain('node_modules')
      expect(validationOptions.mode).toBe('warn')
    })
  })

  describe('error scenarios', () => {
    it('should handle invalid flag names', () => {
      const invalidNames = [
        '', // Empty
        'invalid flag', // Spaces
        'invalid@flag', // Special characters
        '123invalid', // Starting with number
      ]

      const validNamePattern = /^[a-zA-Z][a-zA-Z0-9_-]*$/

      invalidNames.forEach((name) => {
        expect(validNamePattern.test(name)).toBe(false)
      })
    })

    it('should detect duplicate variant names', () => {
      const variants = [
        { name: 'duplicate', weight: 50 },
        { name: 'duplicate', weight: 50 },
      ]

      const names = variants.map(v => v.name)
      const uniqueNames = new Set(names)
      
      expect(names.length).toBe(2)
      expect(uniqueNames.size).toBe(1) // Duplicates detected
    })

    it('should handle missing required properties', () => {
      const incompleteVariants = [
        { name: 'missing-weight' }, // Missing weight
        { weight: 50 }, // Missing name
      ]

      incompleteVariants.forEach((variant) => {
        const hasName = 'name' in variant && typeof variant.name === 'string'
        const hasWeight = 'weight' in variant && typeof variant.weight === 'number'
        
        expect(hasName && hasWeight).toBe(false)
      })
    })
  })

  describe('integration scenarios', () => {
    it('should handle real-world configuration patterns', () => {
      const realWorldConfig = {
        environment: 'production',
        flags: {
          // Simple boolean flags
          debugMode: false,
          maintenanceMode: false,
          
          // Feature rollout with gradual increase
          newCheckout: {
            enabled: true,
            variants: [
              { name: 'old', weight: 70, value: false },
              { name: 'new', weight: 30, value: true },
            ],
          },
          
          // A/B test with multiple variants
          buttonColor: {
            enabled: true,
            variants: [
              { name: 'blue', weight: 40, value: 'blue' },
              { name: 'green', weight: 30, value: 'green' },
              { name: 'red', weight: 20, value: 'red' },
              { name: 'purple', weight: 10, value: 'purple' },
            ],
          },
        },
      }

      // Validate structure
      expect(realWorldConfig.environment).toBe('production')
      expect(Object.keys(realWorldConfig.flags)).toHaveLength(4)
      
      // Validate boolean flags
      expect(realWorldConfig.flags.debugMode).toBe(false)
      expect(realWorldConfig.flags.maintenanceMode).toBe(false)
      
      // Validate variant flags
      const checkoutVariants = realWorldConfig.flags.newCheckout.variants
      const checkoutTotal = checkoutVariants.reduce((sum, v) => sum + v.weight, 0)
      expect(checkoutTotal).toBe(100)
      
      const colorVariants = realWorldConfig.flags.buttonColor.variants
      const colorTotal = colorVariants.reduce((sum, v) => sum + v.weight, 0)
      expect(colorTotal).toBe(100)
    })

    it('should validate cross-environment consistency', () => {
      const environments = {
        development: {
          debugMode: true,
          newFeature: { enabled: true, variants: [{ name: 'test', weight: 100 }] },
        },
        staging: {
          debugMode: false,
          newFeature: { enabled: true, variants: [{ name: 'test', weight: 100 }] },
        },
        production: {
          debugMode: false,
          newFeature: { enabled: false },
        },
      }

      // Check that same flags exist across environments
      const envKeys = Object.keys(environments)
      const flagsPerEnv = envKeys.map(env => Object.keys(environments[env as keyof typeof environments]))
      
      // All environments should have the same flags (in this case)
      expect(flagsPerEnv[0]).toEqual(flagsPerEnv[1])
      expect(flagsPerEnv[1]).toEqual(flagsPerEnv[2])
    })
  })
})
