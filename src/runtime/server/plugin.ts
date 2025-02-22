import type { NitroApp } from 'nitropack/types'
import { defineNitroPlugin } from 'nitropack/runtime'
import { defu } from 'defu'
import { getFlags } from '../core'
import { resolveFlagsConfig, getContext } from './utils'

export default defineNitroPlugin(async (nitroApp: NitroApp) => {
  nitroApp.hooks.hook('request', async (event) => {
    const flagsConfig = resolveFlagsConfig(event)

    const context = await getContext(event)
    const mergedContext = defu(
      context,
      flagsConfig.defaultContext || {},
    )

    const flagDefinitions = flagsConfig.flags || {}
    const evaluatedFlags = getFlags(flagDefinitions)

    event.context.flags = defu(evaluatedFlags, mergedContext.flags)
  })
})
