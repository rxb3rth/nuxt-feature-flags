<script setup lang="ts">
const { isEnabled, flags } = useFeatureFlags()

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
