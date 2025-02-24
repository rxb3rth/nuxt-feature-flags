<script setup lang="ts">
import type { FlagsSchema } from '#build/module/nuxt-feature-flags'

const { isEnabled, flags } = useClientFlags<FlagsSchema>()

console.log(flags.value)
</script>

<template>
  <div>
    <ExperimentalFeature v-if="isEnabled('experimentalFeature')" />
    <pre>
      {{ flags }}
    </pre>
  </div>
</template>
