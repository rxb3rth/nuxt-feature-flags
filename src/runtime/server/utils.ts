import type { H3Event, H3EventContext } from 'h3'
import { useRuntimeConfig } from 'nitropack/runtime'

export function getFlags() {
  const runtimeConfig = useRuntimeConfig()
  return runtimeConfig.public?.featureFlags || {}
}

export async function getContext(event?: H3Event): Promise<H3EventContext> {
  return event?.context
}
