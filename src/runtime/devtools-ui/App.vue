<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDevtoolsClient } from '@nuxt/devtools-kit/iframe-client'

interface FeatureFlagsStatus {
  totalFlags: number
  enabledFlags: number
}

interface FlagConfig {
  enabled?: boolean
  value?: unknown
  variants?: Record<string, unknown>
}

const client = useDevtoolsClient()
const isConnected = computed(() => !!client.value)

// Reactive state
const flags = ref<Record<string, unknown>>({})
const status = ref<FeatureFlagsStatus>({ totalFlags: 0, enabledFlags: 0 })
const loading = ref(true)
const error = ref('')
const notification = ref('')

// RPC functions
let rpc: {
  getFeatureFlagsConfig: () => Promise<{ flags: Record<string, unknown> }>
  getFeatureFlagsStatus: () => Promise<FeatureFlagsStatus>
  toggleFlag: (flagName: string) => Promise<boolean>
} | null = null

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

    // Load initial data
    await loadData()

    // Set up auto-refresh every 5 seconds when connected to DevTools
    setInterval(loadData, 5000)
  }
  else {
    // Fallback to direct API calls
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
        return (flag as FlagConfig).enabled
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

    // Update local state optimistically
    if (flags.value[flagName] && typeof flags.value[flagName] === 'object') {
      (flags.value[flagName] as FlagConfig).enabled = newState
    }
    else {
      flags.value[flagName] = newState
    }

    // Refresh data to get accurate state
    setTimeout(() => {
      loadData()
    }, 300)

    showNotification(`Feature flag "${flagName}" ${newState ? 'enabled' : 'disabled'}`)
  }
  catch (err) {
    console.error('Error toggling flag:', err)
    error.value = `Failed to toggle flag "${flagName}"`
  }
}

function showNotification(message: string) {
  notification.value = message
  setTimeout(() => {
    notification.value = ''
  }, 3000)
}

function canToggleFlag(flag: unknown): boolean {
  // Can't toggle flags with variants
  if (typeof flag === 'object' && flag !== null && 'variants' in flag) {
    return false
  }
  return true
}

function getFlagVariants(flag: unknown): string[] {
  if (typeof flag === 'object' && flag !== null && 'variants' in flag) {
    const flagConfig = flag as FlagConfig
    return Object.keys(flagConfig.variants || {})
  }
  return []
}

function getFlagEnabled(flag: unknown): boolean {
  if (typeof flag === 'boolean') return flag
  if (typeof flag === 'object' && flag !== null && 'enabled' in flag) {
    return (flag as FlagConfig).enabled ?? true
  }
  return true
}

function getFlagValue(flag: unknown): unknown {
  if (typeof flag === 'boolean') return flag
  if (typeof flag === 'object' && flag !== null) {
    const flagConfig = flag as FlagConfig
    return flagConfig.value !== undefined ? flagConfig.value : flagConfig.enabled
  }
  return flag
}

const disabledFlags = computed(() => status.value.totalFlags - status.value.enabledFlags)
</script>

<template>
  <div class="n-bg-base min-h-screen p-6">
    <!-- Header -->
    <div class="mb-6 border-b n-border-base pb-4">
      <h1 class="text-2xl font-semibold text-green-500 mb-2 flex items-center gap-2">
        <div class="i-carbon:flag text-xl" />
        Feature Flags DevTools
      </h1>
      <p class="text-gray-400">
        Monitor and manage your feature flags during development
      </p>
    </div>

    <!-- Connection Status -->
    <div class="mb-4">
      <NTip
        v-if="isConnected"
        n="green"
        icon="carbon:checkmark-outline"
      >
        Connected to DevTools - Real-time updates enabled
      </NTip>
      <NTip
        v-else
        n="yellow"
        icon="carbon:warning"
      >
        DevTools not connected - Using fallback mode
      </NTip>
    </div>

    <!-- Error Display -->
    <div
      v-if="error"
      class="mb-4"
    >
      <NTip
        n="red"
        icon="carbon:warning-alt"
      >
        {{ error }}
      </NTip>
    </div>

    <!-- Notification -->
    <Transition name="slide-down">
      <div
        v-if="notification"
        class="fixed top-4 right-4 z-50"
      >
        <NTip
          n="green"
          icon="carbon:checkmark-outline"
        >
          {{ notification }}
        </NTip>
      </div>
    </Transition>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <NCard class="p-4 text-center">
        <div class="text-3xl font-bold text-green-500 mb-2">
          {{ loading ? '-' : status.totalFlags }}
        </div>
        <div class="text-sm text-gray-400">
          Total Flags
        </div>
      </NCard>

      <NCard class="p-4 text-center">
        <div class="text-3xl font-bold text-blue-500 mb-2">
          {{ loading ? '-' : status.enabledFlags }}
        </div>
        <div class="text-sm text-gray-400">
          Enabled Flags
        </div>
      </NCard>

      <NCard class="p-4 text-center">
        <div class="text-3xl font-bold text-gray-500 mb-2">
          {{ loading ? '-' : disabledFlags }}
        </div>
        <div class="text-sm text-gray-400">
          Disabled Flags
        </div>
      </NCard>
    </div>

    <!-- Flags List -->
    <NCard class="p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">
          Flag Details
        </h2>
        <NButton
          n="green"
          icon="carbon:refresh"
          :disabled="loading"
          @click="loadData"
        >
          Refresh
        </NButton>
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="text-center py-8"
      >
        <NLoading />
        <p class="text-gray-400 mt-2">
          Loading feature flags...
        </p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="Object.keys(flags).length === 0"
        class="text-center py-8"
      >
        <div class="i-carbon:flag text-4xl text-gray-400 mb-2" />
        <p class="text-gray-400">
          No feature flags configured
        </p>
      </div>

      <!-- Flags Grid -->
      <div
        v-else
        class="space-y-3"
      >
        <div
          v-for="(flag, name) in flags"
          :key="name"
          class="flex items-center justify-between p-4 border rounded-lg n-border-base hover:n-bg-active transition-colors"
        >
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="font-medium">
                {{ name }}
              </h3>

              <!-- Variant badges -->
              <template v-if="getFlagVariants(flag).length > 0">
                <NTip
                  v-for="variant in getFlagVariants(flag)"
                  :key="variant"
                  n="blue sm"
                  class="text-xs"
                >
                  {{ variant }}
                </NTip>
              </template>
            </div>

            <div class="text-sm font-mono text-gray-400 mb-1">
              Value: <code>{{ JSON.stringify(getFlagValue(flag)) }}</code>
            </div>

            <div
              v-if="getFlagVariants(flag).length > 0"
              class="text-xs text-gray-500"
            >
              Variant system active - values determined at runtime
            </div>
          </div>

          <div class="flex items-center gap-3">
            <!-- Status Badge -->
            <NTip
              :n="getFlagEnabled(flag) ? 'green' : 'red'"
              class="text-xs font-medium"
            >
              {{ getFlagEnabled(flag) ? 'ENABLED' : 'DISABLED' }}
            </NTip>

            <!-- Toggle Button -->
            <NButton
              v-if="canToggleFlag(flag)"
              n="sm"
              :title="`Toggle ${name}`"
              @click="toggleFlag(name as string)"
            >
              Toggle
            </NButton>

            <NButton
              v-else
              n="sm"
              disabled
              title="Cannot toggle flags with variants"
            >
              Toggle
            </NButton>
          </div>
        </div>
      </div>
    </NCard>

    <!-- Help Section -->
    <NCard class="mt-6 p-4">
      <NSectionBlock
        text="Development Tips"
        description="How to use the Feature Flags DevTools effectively"
        :open="false"
        :padding="false"
      >
        <div class="space-y-3 text-sm">
          <div>
            <h4 class="font-medium mb-1">
              🔄 Real-time Updates
            </h4>
            <p class="text-gray-400">
              When connected to DevTools, flags are automatically refreshed every 5 seconds to show live changes.
            </p>
          </div>

          <div>
            <h4 class="font-medium mb-1">
              🎯 Interactive Toggles
            </h4>
            <p class="text-gray-400">
              Simple boolean flags can be toggled directly. Flags with variants cannot be toggled as they require complex assignment logic.
            </p>
          </div>

          <div>
            <h4 class="font-medium mb-1">
              🔒 Toggle Limitations
            </h4>
            <p class="text-gray-400">
              Flags with variants, context-dependent flags, and environment flags cannot be toggled for safety and consistency.
            </p>
          </div>

          <div>
            <h4 class="font-medium mb-1">
              💾 Session Persistence
            </h4>
            <p class="text-gray-400">
              Flag toggles only affect the current session and don't persist across server restarts.
            </p>
          </div>
        </div>
      </NSectionBlock>
    </NCard>
  </div>
</template>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.3s ease-out;
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
