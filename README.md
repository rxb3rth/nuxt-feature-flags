# Nuxt Feature Flags 🚩

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A feature flag module for Nuxt 3 with context-aware evaluation and server-side support, inspired by @happykit/flags.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
- [📖 &nbsp;Documentation](https://nuxt-feature-flags-docs.vercel.app)

## Features

- 🎯 &nbsp;Context-aware evaluation (user, environment, cookies)
- ⚡ &nbsp;Server-side evaluation
- 🛠 &nbsp;TypeScript ready
- 🔍 &nbsp;Explanation system for flag states
- 🧩 &nbsp;Nuxt 3 composables integration
- 🔧 &nbsp;Runtime configuration support

## Quick Setup

1. Add the module to your Nuxt project:

```bash
npx nuxi module add nuxt-feature-flags
```

2. Create a context file:

```ts
// ~/feature-flags.context.ts
import { parseCookies } from 'h3'
import { detectDevice } from '~/utils/device'

export default function featureFlagsContext(event: any) {
  return {
    user: event?.context.user,
    cookies: parseCookies(event),
    device: detectDevice(event),
    environment: process.env.NODE_ENV
  }
}
```

3. Configure in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-feature-flags'],
  featureFlags: {
    newDashboard: false,
    experimentalFeature: true
  }
})
```

4. Use in components:

```vue
<script setup>
const { isEnabled, get } = useClientFlags()
</script>

<template>
  <div>
    <NewDashboard v-if="isEnabled('newDashboard')" />
    <div v-if="get('experimentalFeature')?.explanation">
      Flag reason: {{ get('experimentalFeature')?.explanation?.reason }}
    </div>
  </div>
</template>
```

## Configuration

### Module Options

```ts
interface ModuleOptions {
  Record<string, FlagDefinition>
}
```

### Example Configuration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  featureFlags: {
    promoBanner: true,
  }
})
```

## Documentation

### Composables

```ts
const { 
  flags,       // Reactive flags object
  isEnabled,   // (flagName: string) => boolean
  get          // <T>(flagName: string) => Flag<T> | undefined
} = useClientFlags()
```

## Contribution

Contributions are welcome! Please follow these steps for local development:

```bash
# Install dependencies
npm install

# Develop with playground
npm run dev

# Lint code
npm run lint
```

## License

MIT License © 2025 Roberth González

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-feature-flags/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-feature-flags

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-feature-flags.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nuxt-feature-flags

[license-src]: https://img.shields.io/npm/l/nuxt-feature-flags.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-feature-flags

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
