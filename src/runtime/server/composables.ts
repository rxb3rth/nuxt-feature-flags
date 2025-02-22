import type { H3Event } from 'h3'
import type { Flag, FlagDefinition } from '../types'

export function useServerFlags<T extends FlagDefinition = FlagDefinition>(event: H3Event) {
  const flags = event.context.flags || {}

  return {
    flags,
    isEnabled(flagName: keyof T): boolean {
      return flags[flagName]?.value ?? false
    },
    get<V = boolean>(flagName: keyof T): Flag<V> | undefined {
      return flags[flagName] as Flag<V> | undefined
    },
  }
}
