import type { NitroApp } from 'nitropack/types'
import { defineNitroPlugin, useRuntimeConfig } from 'nitropack/runtime'
import { getFlags, resolveFlags } from '../core'

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const config = useRuntimeConfig()
  nitroApp.hooks.hook('request', async (event) => {
    const definitions = getFlags(event?.context, config)
    const evaluatedFlags = await resolveFlags(definitions)
    event.context.flags = evaluatedFlags
  })
})
