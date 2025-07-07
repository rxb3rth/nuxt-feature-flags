<script setup lang="ts">
import { useDevtoolsClient } from '@nuxt/devtools-kit/iframe-client'

defineOptions({
  name: 'FeatureFlagsDevTools',
})

const client = useDevtoolsClient()

// State
const flags = ref<Record<string, unknown>>({})
const status = ref({ totalFlags: 0, enabledFlags: 0 })
const loading = ref(true)
const error = ref('')
const notification = ref('')

const isConnected = computed(() => !!client.value)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let rpc: any = null

onMounted(async () => {
  if (client.value) {
    rpc = client.value.devtools.extendClientRpc('nuxt-feature-flags', {
      showNotification(message: string) {
        showNotification(message)
      },
      refreshFlags() {
        loadData()
      },
    })
    
    await loadData()
    setInterval(loadData, 5000)
  }
  else {
    await loadDataFallback()
  }
})

async function loadData() {
  if (!rpc) return
  
  try {
    loading.value = true
    error.value = ''
    
    const [config, statusData] = await Promise.all([
      rpc.getFeatureFlagsConfig(),
      rpc.getFeatureFlagsStatus(),
    ])
    
    flags.value = config.flags || {}
    status.value = statusData
  }
  catch (err) {
    console.error('Error loading data:', err)
    error.value = 'Failed to load feature flags data'
  }
  finally {
    loading.value = false
  }
}

async function loadDataFallback() {
  try {
    loading.value = true
    error.value = ''
    
    const response = await fetch('/api/_feature-flags/feature-flags')
    const data = await response.json()
    
    flags.value = data.flags || {}
    
    const totalFlags = Object.keys(flags.value).length
    const enabledFlags = Object.values(flags.value).filter((flag) => {
      if (typeof flag === 'boolean') return flag
      if (typeof flag === 'object' && flag !== null && 'enabled' in flag) {
        return flag.enabled
      }
      return true
    }).length
    
    status.value = { totalFlags, enabledFlags }
  }
  catch (err) {
    console.error('Error loading fallback data:', err)
    error.value = 'Failed to load feature flags data'
  }
  finally {
    loading.value = false
  }
}

async function toggleFlag(flagName: string) {
  if (!rpc) {
    error.value = 'DevTools RPC not available. Toggle functionality requires DevTools connection.'
    return
  }
  
  try {
    const newState = await rpc.toggleFlag(flagName)
    
    if (flags.value[flagName] && typeof flags.value[flagName] === 'object') {
      flags.value[flagName].enabled = newState
    }
    else {
      flags.value[flagName] = newState
    }
    
    setTimeout(() => loadData(), 300)
    showNotification('Feature flag "' + flagName + '" ' + (newState ? 'enabled' : 'disabled'))
  }
  catch (err) {
    console.error('Error toggling flag:', err)
    error.value = 'Failed to toggle flag "' + flagName + '"'
  }
}

function showNotification(message: string) {
  notification.value = message
  setTimeout(() => {
    notification.value = ''
  }, 3000)
}

function canToggleFlag(flag: any) {
  return !(typeof flag === 'object' && flag !== null && 'variants' in flag)
}

function getFlagVariants(flag: any) {
  if (typeof flag === 'object' && flag !== null && flag.variants) {
    return Object.keys(flag.variants)
  }
  return []
}

function getFlagEnabled(flag: any) {
  if (typeof flag === 'boolean') return flag
  if (typeof flag === 'object' && flag !== null && 'enabled' in flag) {
    return flag.enabled
  }
  return true
}

function getFlagValue(flag: any) {
  if (typeof flag === 'boolean') return flag
  if (typeof flag === 'object' && flag !== null) {
    return flag.value !== undefined ? flag.value : flag.enabled
  }
  return flag
}

const disabledFlags = computed(() => status.value.totalFlags - status.value.enabledFlags)
</script>

<template>
  <div class="relative p-6 n-bg-base flex flex-col h-screen">
    <!-- Header -->
    <div class="mb-6 pb-4 border-b border-base">
      <NIconTitle icon="carbon-flag" text="Feature Flags DevTools" class="text-2xl font-semibold mb-2 text-primary" />
      <p class="text-secondary">Monitor and manage your feature flags during development</p>
    </div>

    <!-- Connection Status -->
    <div class="mb-4">
      <div v-if="isConnected" class="flex flex-wrap gap-2 mb-2">
        <NTip n="green" icon="carbon-checkmark">
          Connected to DevTools - Real-time updates enabled
        </NTip>
        <div class="text-sm opacity-70">
          The current app is using
          <code class="text-green">vue@{{ client.host?.nuxt.vueApp.version || 'unknown' }}</code>
        </div>
      </div>
      <NTip v-else n="yellow" icon="carbon-warning">
        DevTools not connected - Using fallback mode
      </NTip>
      
      <div v-if="isConnected" class="flex gap-2 mt-2">
        <NButton
          n="green"
          size="sm"
          @click="client!.host?.devtools?.close()"
        >
          Close DevTools
        </NButton>
        <NButton
          n="blue"
          size="sm"
          @click="loadData"
          :disabled="loading"
        >
          Refresh Data
        </NButton>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="mb-4">
      <NTip n="red" icon="carbon-warning-alt">{{ error }}</NTip>
    </div>

    <!-- Notification -->
    <div v-if="notification" class="fixed top-4 right-4 z-50">
      <NTip n="green" icon="carbon-checkmark">{{ notification }}</NTip>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <NCard class="p-4 text-center">
        <div class="text-3xl font-bold mb-2 text-primary">
          {{ loading ? '-' : status.totalFlags }}
        </div>
        <div class="text-sm text-secondary">Total Flags</div>
      </NCard>
      
      <NCard class="p-4 text-center">
        <div class="text-3xl font-bold mb-2 text-blue">
          {{ loading ? '-' : status.enabledFlags }}
        </div>
        <div class="text-sm text-secondary">Enabled Flags</div>
      </NCard>
      
      <NCard class="p-4 text-center">
        <div class="text-3xl font-bold mb-2 text-gray">
          {{ loading ? '-' : disabledFlags }}
        </div>
        <div class="text-sm text-secondary">Disabled Flags</div>
      </NCard>
    </div>

    <!-- Flags List -->
    <NCard class="p-6 flex-1 overflow-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Flag Details</h2>
        <NButton n="green" icon="carbon-refresh" @click="loadData" :disabled="loading">
          Refresh
        </NButton>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <NLoading>Loading feature flags...</NLoading>
      </div>

      <!-- Empty State -->
      <div v-else-if="Object.keys(flags).length === 0" class="text-center py-8">
        <div class="text-6xl mb-4">🚩</div>
        <p class="text-secondary">No feature flags configured</p>
      </div>

      <!-- Flags Grid -->
      <div v-else class="space-y-3">
        <div v-for="(flag, name) in flags" :key="name" class="flag-item border border-base rounded-lg p-4 flex items-center justify-between hover:bg-active transition-colors">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <h3 class="font-medium">{{ name }}</h3>
              
              <!-- Variant badges -->
              <NBadge 
                v-for="variant in getFlagVariants(flag)" 
                :key="variant" 
                n="blue"
                class="text-xs"
              >
                {{ variant }}
              </NBadge>
            </div>
            
            <div class="text-sm font-mono mb-1 text-secondary">
              Value: <code>{{ JSON.stringify(getFlagValue(flag)) }}</code>
            </div>
            
            <div v-if="getFlagVariants(flag).length > 0" class="text-xs text-gray">
              Variant system active - values determined at runtime
            </div>
          </div>

          <div class="flex items-center gap-3">
            <!-- Status Badge -->
            <NBadge :n="getFlagEnabled(flag) ? 'green' : 'red'" class="text-xs">
              {{ getFlagEnabled(flag) ? 'ENABLED' : 'DISABLED' }}
            </NBadge>

            <!-- Toggle Button -->
            <NButton 
              v-if="canToggleFlag(flag)"
              n="sm"
              @click="toggleFlag(name)"
              :title="'Toggle ' + name"
              :icon="getFlagEnabled(flag) ? 'carbon-toggle-on' : 'carbon-toggle-off'"
            >
              Toggle
            </NButton>
            
            <NButton 
              v-else
              n="sm" 
              disabled
              title="Cannot toggle flags with variants"
              icon="carbon-locked"
            >
              Toggle
            </NButton>
          </div>
        </div>
      </div>
    </NCard>

    <!-- Help Section -->
    <NCard class="mt-6 p-4">
      <details>
        <summary class="font-medium cursor-pointer mb-3 flex items-center gap-2">
          <NIcon icon="carbon-information" />
          Development Tips
        </summary>
        <div class="space-y-3 text-sm ml-4">
          <div>
            <h4 class="font-medium mb-1 flex items-center gap-2">
              <NIcon icon="carbon-refresh" />
              Real-time Updates
            </h4>
            <p class="text-secondary">
              When connected to DevTools, flags are automatically refreshed every 5 seconds to show live changes.
            </p>
          </div>
          
          <div>
            <h4 class="font-medium mb-1 flex items-center gap-2">
              <NIcon icon="carbon-toggle-on" />
              Interactive Toggles
            </h4>
            <p class="text-secondary">
              Simple boolean flags can be toggled directly. Flags with variants cannot be toggled as they require complex assignment logic.
            </p>
          </div>
          
          <div>
            <h4 class="font-medium mb-1 flex items-center gap-2">
              <NIcon icon="carbon-locked" />
              Toggle Limitations
            </h4>
            <p class="text-secondary">
              Flags with variants, context-dependent flags, and environment flags cannot be toggled for safety and consistency.
            </p>
          </div>
          
          <div>
            <h4 class="font-medium mb-1 flex items-center gap-2">
              <NIcon icon="carbon-time" />
              Session Persistence
            </h4>
            <p class="text-secondary">
              Flag toggles only affect the current session and don't persist across server restarts.
            </p>
          </div>
        </div>
      </details>
    </NCard>

    <!-- Module Author Note -->
    <div class="flex-auto" />
    <ModuleAuthorNote class="mt-5" />
  </div>
</template>

<style scoped>
.flag-item:hover {
  background-color: rgba(var(--nui-c-bg-active), 0.5);
}
</style>
