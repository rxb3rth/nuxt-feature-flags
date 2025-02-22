<script setup lang="ts">
import type { FlagDefinition } from '../dist/runtime/types'

interface FlagsSchema extends FlagDefinition {
  newDashboard: boolean
  experimentalFeature: boolean
}

const { isEnabled, get, flags } = useClientFlags<FlagsSchema>()
</script>

<template>
  <div>
    <ExperimentalFeature v-if="isEnabled('experimentalFeature')" />
    <div v-if="get('newDashboard')?.explanation">
      Reason: {{ get('')?.explanation?.reason }}
    </div>
    <pre>
      {{ flags }}
    </pre>
  </div>
</template>
