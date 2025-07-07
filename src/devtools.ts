import { existsSync } from 'node:fs'
import type { Nuxt } from '@nuxt/schema'
import { extendServerRpc, onDevToolsInitialized } from '@nuxt/devtools-kit'
import { createResolver } from '@nuxt/kit'
import type { FeatureFlagsConfig, ClientFunctions, ServerFunctions } from './types'

const RPC_NAMESPACE = 'nuxt-feature-flags'
const DEVTOOLS_UI_ROUTE = '/__nuxt-feature-flags'
const DEVTOOLS_UI_LOCAL_PORT = 3300

export function setupDevToolsIntegration(options: FeatureFlagsConfig, nuxt: Nuxt) {
  const resolver = createResolver(import.meta.url)
  const clientPath = resolver.resolve('./dist/client')
  const isProductionBuild = existsSync(clientPath)

  // Serve production-built client (used when package is published)
  if (isProductionBuild) {
    nuxt.hook('vite:serverCreated', async (server) => {
      const sirv = await import('sirv').then(r => r.default || r)
      server.middlewares.use(
        DEVTOOLS_UI_ROUTE,
        sirv(clientPath, { dev: true, single: true }),
      )
    })
  }
  // In local development, start a separate Nuxt Server and proxy to serve the client
  else {
    nuxt.hook('vite:extendConfig', (config) => {
      config.server = config.server || {}
      config.server.proxy = config.server.proxy || {}
      config.server.proxy[DEVTOOLS_UI_ROUTE] = {
        target: 'http://localhost:' + DEVTOOLS_UI_LOCAL_PORT + DEVTOOLS_UI_ROUTE,
        changeOrigin: true,
        followRedirects: true,
        rewrite: path => path.replace(DEVTOOLS_UI_ROUTE, ''),
      }
    })
  }

  // Register the DevTools tab
  nuxt.hook('devtools:customTabs', (tabs) => {
    tabs.push({
      // unique identifier
      name: 'nuxt-feature-flags',
      // title to display in the tab
      title: 'Feature Flags',
      // any icon from Iconify, or a URL to an image
      icon: 'carbon:flag',
      // iframe view
      view: {
        type: 'iframe',
        src: DEVTOOLS_UI_ROUTE,
      },
    })
  })

  // Wait for DevTools to be initialized
  onDevToolsInitialized(async () => {
    const rpc = extendServerRpc<ClientFunctions, ServerFunctions>(RPC_NAMESPACE, {
      // Server RPC functions
      getFeatureFlagsConfig() {
        return options
      },

      async getFeatureFlagsStatus() {
        // This would be called from the DevTools view to get current status
        return {
          totalFlags: Object.keys(options.flags || {}).length,
          enabledFlags: Object.entries(options.flags || {}).filter(([, config]) => {
            if (typeof config === 'boolean') return config
            if (typeof config === 'object' && config !== null && 'enabled' in config) {
              return config.enabled
            }
            return true
          }).length,
        }
      },

      async toggleFlag(flagName: string) {
        // In a real implementation, you might want to persist this change
        // For development/testing, we'll modify the runtime config temporarily
        const flag = options.flags?.[flagName]
        if (!flag) {
          throw new Error(`Flag "${flagName}" not found`)
        }

        // Don't allow toggling flags with variants as they have complex logic
        if (typeof flag === 'object' && flag !== null && 'variants' in flag) {
          throw new Error(`Cannot toggle flag "${flagName}" - it has variants`)
        }

        let newState = false
        if (typeof flag === 'boolean') {
          newState = !flag
          // Update the runtime options
          if (options.flags) {
            options.flags[flagName] = newState
          }
        }
        else if (typeof flag === 'object' && flag !== null && 'enabled' in flag) {
          newState = !flag.enabled
          // Update the runtime options
          if (options.flags) {
            const flagConfig = options.flags[flagName] as { enabled: boolean }
            flagConfig.enabled = newState
          }
        }

        // Broadcast the change to all connected clients
        await rpc.broadcast.refreshFlags?.()

        return newState
      },
    })

    // Broadcast notifications when DevTools connects
    await rpc.broadcast.showNotification?.('Feature Flags DevTools connected!')
  })
}
