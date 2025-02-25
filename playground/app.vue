<script setup lang="ts">
const { isEnabled, flags } = useClientFlags()

console.log(flags.value)
</script>

<template>
  <div>
    <ExperimentalFeature v-if="isEnabled('isAdmin')" />
    <pre>
      {{ flags }}
    </pre>
  </div>
</template>
