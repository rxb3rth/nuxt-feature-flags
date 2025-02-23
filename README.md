# Nuxt Feature Flags 🚩

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A powerful, type-safe feature flag module for Nuxt 3 that enables both static and dynamic feature flag evaluation with server-side support. Perfect for A/B testing, gradual rollouts, and feature management.

## ✨ Features

- 🎯 **Context-aware evaluation**: Evaluate flags based on request context (user roles, geo-location, device type, etc.)
- 🛠 **TypeScript Ready**: Full TypeScript support with type-safe flag definitions and autocomplete
- 🔍 **Explanation System**: Understand why flags are enabled/disabled with detailed explanations
- 🧩 **Nuxt 3 Integration**: Seamless integration with auto-imports and runtime config
- 🎯 **Static & Dynamic Flags**: Support for both simple boolean flags and dynamic evaluation
- 🔒 **Type Safety**: Catch errors early with full type inference and validation

## 📦 Installation

```bash
# Using npx
npx nuxi module add nuxt-feature-flags

# Using npm
npm install nuxt-feature-flags

# Using yarn
yarn add nuxt-feature-flags

# Using pnpm
pnpm add nuxt-feature-flags
```

## 🚀 Quick Setup

1. Add the module to your `nuxt.config.ts`:

Basic usage providing plain configuration.
```ts
export default defineNuxtConfig({
  modules: ['nuxt-feature-flags'],
  featureFlags: {
    flags: {
      newDashboard: false,
      experimentalFeature: true
    }
  }
})
```

Basic usage providing configuration file.
```ts
export default defineNuxtConfig({
  modules: ['nuxt-feature-flags'],
  featureFlags: {
    config: './feature-flags.config.ts',
  }
})
```

Advance usage providing context based flag rules (Only for api route requests).
```ts
// feature-flags.config.ts
import type { H3EventContext } from 'h3'

// Context available only on server, context will be undefined at the client side
export default function featureFlagsConfig(context?: H3EventContext) {
  return {
    isAdmin: context?.user?.role === 'admin',
    newDashboard: true,
    experimentalFeature: process.env.NODE_ENV === 'development',
    promoBanner: false,
    betaFeature: false,
  }
}
```

2. Use in your Vue components:

```vue
<script setup>
const { isEnabled, get } = useClientFlags()
</script>

<template>
  <div>
    <NewDashboard v-if="isEnabled('newDashboard')" />
    <div v-if="get('experimentalFeature')?.explanation">
      Flag enabled because: {{ get('experimentalFeature').explanation.reason }}
    </div>
  </div>
</template>
```

3. Use in your server routes:

```ts
// server/api/dashboard.ts
export default defineEventHandler((event) => {
  const { isEnabled } = await useServerFlags(event)

  if (!isEnabled('newDashboard')) {
    throw createError({
      statusCode: 404,
      message: 'Dashboard not available'
    })
  }

  return {
    stats: {
      users: 100,
      revenue: 50000
    }
  }
})
```

## 📖 Documentation

Visit our [documentation site](https://nuxt-feature-flags-docs.vercel.app) for detailed guides and API reference.

### Client-Side Usage

```ts
const { 
  flags,       // Reactive flags object
  isEnabled,   // (flagName: string) => boolean
  get          // <T>(flagName: string) => Flag<T> | undefined
} = useClientFlags()

// Check if a flag is enabled
if (isEnabled('newFeature')) {
  // Feature is enabled
}

// Get flag with explanation
const flag = get('experimentalFeature')
console.log(flag.explanation)
```

### Server-Side Usage

```ts
const { 
  flags,       // Flags object
  isEnabled,   // (flagName: string) => boolean
  get          // <T>(flagName: string) => Flag<T> | undefined
} = await useServerFlags(event)

// Check if a flag is enabled
if (isEnabled('newFeature')) {
  // Feature is enabled
}

// Get flag with explanation
const flag = get('experimentalFeature')
console.log(flag.explanation)
```

### Flag Types

```ts
interface Flag<T = boolean> {
  value: T
  explanation?: {
    reason: 'STATIC' | 'TARGETING_MATCH' | 'DEFAULT'
    rule?: string
  }
}
```

## ⚙️ Configuration

```ts
interface FeatureFlagsConfig {
  flags?: FlagDefinition // Feature flags object
  config?: string // Path to configuration file
}

type FlagDefinition = Record<string, boolean>

// Example of inline configuration
export default defineNuxtConfig({
  featureFlags: {
    flags: {
      promoBanner: true,
      betaFeature: false,
      newDashboard: false
    }
  }
})

// Example of configuration file
// feature-flags.config.ts
export default {
  isAdmin: false,
  newDashboard: true,
  experimentalFeature: true,
  promoBanner: false,
  betaFeature: false,
}

// nuxt.config
export default defineNuxtConfig({
  featureFlags: {
    flags: {
      config: './feature-flags.config.ts',
    }
  }
})
```

## 🤝 Contributing

1. Clone this repository
2. Install dependencies using `npm install`
3. Start development server using `npm run dev`
4. Make your changes
5. Submit a pull request

## 📄 License

[MIT License](./LICENSE) © 2025 Roberth González

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-feature-flags/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-feature-flags

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-feature-flags.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nuxt-feature-flags

[license-src]: https://img.shields.io/npm/l/nuxt-feature-flags.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-feature-flags

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com