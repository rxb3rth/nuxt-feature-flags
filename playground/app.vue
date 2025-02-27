<script setup lang="ts">
const { isEnabled, flags } = useClientFlags()

console.log(flags.value)
</script>

<template>
  <div>
    <pre>
      {{ flags }}
    </pre>
  </div>
</template>
