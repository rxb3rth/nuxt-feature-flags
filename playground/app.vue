<script setup>
const { isEnabled, get, flags } = useFeatureFlags()
</script>

<template>
  <div>
    <pre>
      {{ isEnabled('experimentalFeature') }}
      {{ get('newDashboard') }}
    </pre>
    <ExperimentalFeature v-if="isEnabled('experimentalFeature')" />
    <div v-if="get('newDashboard')?.explanation">
      Reason: {{ get('newDashboard')?.explanation?.reason }}
    </div>
    <pre>
      {{ flags }}
    </pre>
  </div>
</template>
