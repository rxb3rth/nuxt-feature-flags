<script setup lang="ts">
import type { FlagsSchema } from '#build/types/nuxt-feature-flags'

const { isEnabled, get, flags } = useClientFlags<FlagsSchema>()
</script>

<template>
  <div>
    <ExperimentalFeature v-if="isEnabled('experimentalFeature')" />
    <div v-if="get('newDashboard')?.explanation">
      Reason: {{ get('newDashboard')?.explanation?.reason }}
    </div>
    <pre>
      {{ flags }}
    </pre>
  </div>
</template>
