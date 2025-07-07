import type { H3Event } from 'h3'
import { getCookie } from 'h3'
import { useRuntimeConfig } from '#imports'
import type { FlagConfig, FlagValue, VariantContext } from '../../types/feature-flags'
import { getVariantForFlag } from './variant-assignment'

export interface ResolvedFlag {
  enabled: boolean
  value?: FlagValue
  variant?: string
}

export interface ResolvedFlags {
  [key: string]: ResolvedFlag
}

/**
 * Extract context for variant assignment
 */
function getVariantContext(event: H3Event): VariantContext {
  // Try to get user ID from context (could be set by auth middleware)
  const userId = event.context.user?.id || event.context.userId

  // Try to get session ID from cookie
  const sessionId = getCookie(event, 'session-id') || getCookie(event, 'nuxt-session')

  // Get IP address as fallback (use headers as h3 doesn't export getClientIP in all versions)
  const forwarded = event.node.req.headers['x-forwarded-for']
  const ipAddress = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0] || event.node.req.socket.remoteAddress

  return {
    userId,
    sessionId,
    ipAddress,
  }
}

/**
 * Resolve a flag value considering variants
 */
function resolveFlagValue(
  flagName: string,
  flagValue: unknown,
  context: VariantContext,
): ResolvedFlag {
  // Simple boolean/value flag
  if (typeof flagValue !== 'object' || flagValue === null || Array.isArray(flagValue)) {
    let enabled: boolean
    if (Array.isArray(flagValue)) {
      enabled = flagValue.length > 0
    } else {
      enabled = !!(flagValue as FlagValue)
    }
    return {
      enabled,
      value: flagValue as FlagValue,
    }
  }

  const flagConfig = flagValue as FlagConfig

  // If flag is disabled, return early
  if (!flagConfig.enabled) {
    return {
      enabled: false,
      value: flagConfig.value,
    }
  }

  // Handle variants
  if (flagConfig.variants && flagConfig.variants.length > 0) {
    try {
      const assignedVariant = getVariantForFlag(flagName, flagConfig.variants, context)
      
      if (assignedVariant) {
        return {
          enabled: true,
          value: assignedVariant.value !== undefined ? assignedVariant.value : flagConfig.value,
          variant: assignedVariant.name,
        }
      }
    }
    catch (error) {
      // If variant assignment fails, fall back to default behavior
      console.warn(`Variant assignment failed for flag ${flagName}:`, error)
    }
  }

  // Default case - enabled flag without variants
  return {
    enabled: true,
    value: flagConfig.value,
  }
}

export function getFeatureFlags(event: H3Event) {
  // Get flags from runtime config
  const runtimeConfig = useRuntimeConfig()
  const flags = runtimeConfig.public?.featureFlags?.flags || runtimeConfig.featureFlags?.flags || {}

  const context = getVariantContext(event)
  const resolvedFlags: ResolvedFlags = {}

  // Resolve all flags with variant support
  for (const [flagName, flagValue] of Object.entries(flags)) {
    resolvedFlags[flagName] = resolveFlagValue(flagName, flagValue, context)
  }

  return {
    flags: resolvedFlags,
    isEnabled(flagName: string, variant?: string): boolean {
      const flag = resolvedFlags[flagName]
      if (!flag?.enabled) return false
      
      // If variant is specified, check if it matches
      if (variant && flag.variant !== variant) return false
      
      return true
    },
    getVariant(flagName: string): string | undefined {
      return resolvedFlags[flagName]?.variant
    },
    getValue(flagName: string): FlagValue | undefined {
      return resolvedFlags[flagName]?.value
    },
  }
}

/**
 * Standalone function to check if a feature flag is enabled
 * Useful for simple flag checking without full context
 */
export function isFeatureEnabled(flagName: string, variant?: string): boolean {
  const runtimeConfig = useRuntimeConfig()
  const flags = runtimeConfig.public?.featureFlags?.flags || runtimeConfig.featureFlags?.flags || {}

  const flagValue = flags[flagName]
  if (!flagValue) return false

  // Create basic context for variant assignment (empty since we don't have an event)
  const context: VariantContext = {}
  const resolvedFlag = resolveFlagValue(flagName, flagValue, context)

  if (!resolvedFlag.enabled) return false

  // If variant is specified, check if it matches
  if (variant && resolvedFlag.variant !== variant) return false

  return true
}
