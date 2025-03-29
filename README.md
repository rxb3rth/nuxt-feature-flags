# Nuxt Feature Flags 🚩
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A powerful, type-safe feature flag module for Nuxt 3 that enables both static and dynamic feature flag evaluation with server-side support. Perfect for A/B testing, gradual rollouts, and feature management.

> [!WARNING]
> This project is just getting started, so things are gonna change a lot. Updates will roll out often, and we're totally open to feedback—hit us up with your thoughts!

## ✨ Features

- 🎯 **Context-aware evaluation**: Evaluate flags based on request context (user roles, geo-location, device type, etc.)
- 🛠 **TypeScript Ready**: Full TypeScript support with type-safe flag definitions and autocomplete
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

```ts
// Basic usage with plain configuration
export default defineNuxtConfig({
  modules: ['nuxt-feature-flags'],
  featureFlags: {
    flags: {
      newDashboard: false,
      experimentalFeature: true
    }
  }
})

// Advanced usage with context-based flag rules
// feature-flags.config.ts
import { defineFeatureFlags } from '#feature-flags/handler'

export default defineFeatureFlags((context) => {
  return {
    isAdmin: context?.user?.role === 'admin',
    newDashboard: true,
    experimentalFeature: process.env.NODE_ENV === 'development',
    betaFeature: context?.user?.isBetaTester ?? false,
  }
})

// nuxt.config.ts
export default defineNuxtConfig({
  featureFlags: {
    config: './feature-flags.config.ts',
  }
})
```

2. Use in your Vue components:

```vue
<script setup>
const { isEnabled } = useFeatureFlags()
</script>

<template>
  <div>
    <NewDashboard v-if="isEnabled('newDashboard')" />
  </div>
</template>
```

3. Use in your server routes:

```ts
// server/api/dashboard.ts
export default defineEventHandler(async (event) => {
  const { isEnabled } = getFeatureFlags(event)

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

### Client-Side Usage

```ts
const { 
  flags,       // Reactive flags object
  isEnabled,   // (flagName: string) => boolean
} = useFeatureFlags()

// Check if a flag is enabled
if (isEnabled('newFeature')) {
  // Feature is enabled
}
```

### Server-Side Usage

```ts
const { 
  flags,       // Flags object
  isEnabled,   // (flagName: string) => boolean
} = getFeatureFlags(event)

// Check if a flag is enabled
if (isEnabled('newFeature')) {
  // Feature is enabled
}
```

## ⚙️ Configuration Methods

### 1. Inline Configuration

```ts
export default defineNuxtConfig({
  featureFlags: {
    flags: {
      promoBanner: true,
      betaFeature: false,
      newDashboard: false
    }
  }
})
```

### 2. Configuration File

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  featureFlags: {
    config: './feature-flags.config.ts',
  }
})

// feature-flags.config.ts
import { defineFeatureFlags } from '#feature-flags/handler'

export default defineFeatureFlags(() => ({
  isAdmin: false,
  newDashboard: true,
  experimentalFeature: true,
  promoBanner: false,
  betaFeature: false,
}))
```

### 3. Context-Aware Configuration

```ts
// feature-flags.config.ts
import { defineFeatureFlags } from '#feature-flags/handler'

export default defineFeatureFlags((context) => {
  return {
    // User role-based flag
    isAdmin: context?.user?.role === 'admin',
    
    // Environment-based flag
    devTools: process.env.NODE_ENV === 'development',
    
    // User status-based flag
    betaFeature: context?.user?.isBetaTester ?? false,
    
    // Device-based flag
    mobileFeature: context?.device?.isMobile ?? false,
  }
})
```

## 🤝 Contributing

1. Clone this repository
2. Install dependencies using `npm install`
3. Start development server using `npm run dev`
4. Make your changes
5. Submit a pull request

## ✨ Contributors 

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://x.com/rxb3rth"><img src="https://avatars.githubusercontent.com/u/63687573?v=4?s=100" width="100px;" alt="Eugen Istoc"/><br /><sub><b>Roberth González</b></sub></a><br /><a href="https://github.com/rxb3rth/nuxt-feature-flags/commits?author=rxb3rth" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://www.eugenistoc.com"><img src="https://avatars.githubusercontent.com/u/928780?v=4?s=100" width="100px;" alt="Eugen Istoc"/><br /><sub><b>Eugen Istoc</b></sub></a><br /><a href="https://github.com/rxb3rth/nuxt-feature-flags/commits?author=genu" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://roe.dev"><img src="https://avatars.githubusercontent.com/u/28706372?v=4?s=100" width="100px;" alt="Daniel Roe"/><br /><sub><b>Daniel Roe</b></sub></a><br /><a href="https://github.com/rxb3rth/nuxt-feature-flags/commits?author=danielroe" title="Documentation">📖</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

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