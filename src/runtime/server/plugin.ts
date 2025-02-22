import type { NitroApp } from 'nitropack/types'
import { defineNitroPlugin } from 'nitropack/runtime'
import { defu } from 'defu'
import { resolveFlags } from '../core'
import { getFlags, getContext } from './utils'

export default defineNitroPlugin(async (nitroApp: NitroApp) => {
  nitroApp.hooks.hook('request', async (event) => {
    const flagDefinitions = getFlags() || {}
    const evaluatedFlags = resolveFlags(flagDefinitions)
    const context = await getContext(event)
    event.context.flags = defu(evaluatedFlags, context.flags || {})
  })
})
