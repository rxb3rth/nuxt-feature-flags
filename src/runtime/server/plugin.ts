import type { NitroApp } from 'nitropack/types'
import { defineNitroPlugin } from 'nitropack/runtime'
import { resolveFlags } from '../core'
import { getFlags } from './utils'

export default defineNitroPlugin((nitroApp: NitroApp) => {
  nitroApp.hooks.hook('request', async (event) => {
    const flagDefinitions = getFlags() || {}
    const evaluatedFlags = await resolveFlags(flagDefinitions)
    event.context.flags = evaluatedFlags
  })
})
