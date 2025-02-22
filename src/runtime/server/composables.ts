import type { H3Event } from 'h3'
import type { Flag } from '../types'

export function useServerFlags(event: H3Event) {
  const flags = event.context.flags || {}

  return {
    flags,
    isEnabled(flagName: string): boolean {
      return flags[flagName]?.value ?? false
    },
    get<T = boolean>(flagName: string): Flag<T> | undefined {
      return flags[flagName] as Flag<T> | undefined
    },
  }
}
