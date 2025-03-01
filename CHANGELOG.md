## v0.5.0

[compare changes](https://github.com/rxb3rth/nuxt-feature-flags/compare/v0.4.0...v0.5.0)

# Changelog


## v0.4.1

[compare changes](https://github.com/rxb3rth/nuxt-feature-flags/compare/v0.4.0...v0.4.1)

## v0.3.0

[compare changes](https://github.com/rxb3rth/nuxt-feature-flags/compare/v0.2.3...v0.3.0)

### 🚀 Enhancements

- Add file existence check for feature flags configuration ([9b8be41](https://github.com/rxb3rth/nuxt-feature-flags/commit/9b8be41))
- Add file existence check when loading configuration ([c704852](https://github.com/rxb3rth/nuxt-feature-flags/commit/c704852))

### 🩹 Fixes

- Makes typescript check known properties ([c7ffbda](https://github.com/rxb3rth/nuxt-feature-flags/commit/c7ffbda))
- Update release command to use pnpm dlx ([f70441c](https://github.com/rxb3rth/nuxt-feature-flags/commit/f70441c))
- Update release script to use changelogen instead of release ([d2047e3](https://github.com/rxb3rth/nuxt-feature-flags/commit/d2047e3))
- Update repository field in package.json to include type and URL ([9168855](https://github.com/rxb3rth/nuxt-feature-flags/commit/9168855))

### 💅 Refactors

- Remove unnecessary line from feature flags loading process ([237f16e](https://github.com/rxb3rth/nuxt-feature-flags/commit/237f16e))
- Enhance FlagsSchema type definition for improved TypeScript key handling ([9b2b253](https://github.com/rxb3rth/nuxt-feature-flags/commit/9b2b253))
- Update useClientFlags and useServerFlags to utilize FlagsSchema for improved type safety ([ae11450](https://github.com/rxb3rth/nuxt-feature-flags/commit/ae11450))
- Remove FlagsSchema type usage in useClientFlags and useServerFlags for simplified implementation ([c9b178b](https://github.com/rxb3rth/nuxt-feature-flags/commit/c9b178b))

### 📖 Documentation

- Remove explanation system from README for clarity ([99c95d6](https://github.com/rxb3rth/nuxt-feature-flags/commit/99c95d6))
- Add contributors section to README for improved community recognition ([34ea253](https://github.com/rxb3rth/nuxt-feature-flags/commit/34ea253))
- Update README.md [skip ci] ([a7a2c40](https://github.com/rxb3rth/nuxt-feature-flags/commit/a7a2c40))
- Create .all-contributorsrc [skip ci] ([ac7fd8e](https://github.com/rxb3rth/nuxt-feature-flags/commit/ac7fd8e))
- Update README.md [skip ci] ([0d2cc0f](https://github.com/rxb3rth/nuxt-feature-flags/commit/0d2cc0f))
- Update .all-contributorsrc [skip ci] ([e03a55d](https://github.com/rxb3rth/nuxt-feature-flags/commit/e03a55d))
- Add Roberth González to contributors list ([f6509d3](https://github.com/rxb3rth/nuxt-feature-flags/commit/f6509d3))

### 🏡 Chore

- Update release script to use custom node script for improved flexibility ([e3cb975](https://github.com/rxb3rth/nuxt-feature-flags/commit/e3cb975))

### ❤️ Contributors

- Roberth González <reliutg@gmail.com>
- Eugen Istoc <eugenistoc@gmail.com>

## v0.2.3

[compare changes](https://github.com/rxb3rth/nuxt-feature-flags/compare/v0.2.2...v0.2.3)

### 🩹 Fixes

- Allow optional context parameter in getFlags function ([9bb6c35](https://github.com/rxb3rth/nuxt-feature-flags/commit/9bb6c35))
- Reorder parameters in getFlags function for consistency ([65881a8](https://github.com/rxb3rth/nuxt-feature-flags/commit/65881a8))

### 💅 Refactors

- Simplify flag handling by removing unused get method and explanations ([4e84c05](https://github.com/rxb3rth/nuxt-feature-flags/commit/4e84c05))
- Update flag handling to improve type safety and simplify isEnabled checks ([2f6d76d](https://github.com/rxb3rth/nuxt-feature-flags/commit/2f6d76d))

### 📖 Documentation

- Update README with improved configuration examples and usage instructions ([b7aafdf](https://github.com/rxb3rth/nuxt-feature-flags/commit/b7aafdf))

### 🏡 Chore

- **release:** V0.2.2 ([efede2e](https://github.com/rxb3rth/nuxt-feature-flags/commit/efede2e))

### ❤️ Contributors

- Roberth González <reliutg@gmail.com>

## v0.2.2

[compare changes](https://github.com/rxb3rth/nuxt-feature-flags/compare/v0.2.1...v0.2.2)

### 🚀 Enhancements

- Replace feature-flags.config.js with dynamic feature-flags.config.ts for improved context handling ([1c184a1](https://github.com/rxb3rth/nuxt-feature-flags/commit/1c184a1))
- Update nuxt.config.ts to use TypeScript feature flags configuration ([70558fc](https://github.com/rxb3rth/nuxt-feature-flags/commit/70558fc))
- Add user role context to dashboard API handler and update flags retrieval to async ([ca5386b](https://github.com/rxb3rth/nuxt-feature-flags/commit/ca5386b))
- Update feature flags configuration handling and improve runtime imports ([1c3fbfd](https://github.com/rxb3rth/nuxt-feature-flags/commit/1c3fbfd))
- Refactor server flags handling to support dynamic configuration loading and remove obsolete plugin ([1f5dc45](https://github.com/rxb3rth/nuxt-feature-flags/commit/1f5dc45))
- Enhance feature flags configuration with generic type support and add defineFeatureFlagsConfig function ([afd6bfd](https://github.com/rxb3rth/nuxt-feature-flags/commit/afd6bfd))
- Add 'jiti' to the build configuration dependencies ([a17f9d2](https://github.com/rxb3rth/nuxt-feature-flags/commit/a17f9d2))

### 🩹 Fixes

- Suppress TypeScript linting errors for temporary comments in module setup ([d4a4fbc](https://github.com/rxb3rth/nuxt-feature-flags/commit/d4a4fbc))
- Suppress TypeScript linting errors by adding eslint-disable comments and remove unused imports ([e355d15](https://github.com/rxb3rth/nuxt-feature-flags/commit/e355d15))
- Remove unused imports and commented-out code in types.ts ([088ccba](https://github.com/rxb3rth/nuxt-feature-flags/commit/088ccba))

### 📖 Documentation

- Update README with context-aware evaluation and configuration examples for feature flags ([c0c21c2](https://github.com/rxb3rth/nuxt-feature-flags/commit/c0c21c2))

### ❤️ Contributors

- Roberth González <reliutg@gmail.com>

## v0.2.1

[compare changes](https://github.com/rxb3rth/nuxt-feature-flags/compare/v0.2.0...v0.2.1)

## v0.1.1

[compare changes](https://github.com/rxb3rth/nuxt-feature-flags/compare/v0.1.0...v0.1.1)

## v0.0.3

[compare changes](https://github.com/rxb3rth/nuxt-feature-flags/compare/v0.0.2...v0.0.3)

### 🚀 Enhancements

- Add flags display to feature flags usage in app.vue ([91049f3](https://github.com/rxb3rth/nuxt-feature-flags/commit/91049f3))
- Add middleware to handle feature flags and log requests ([c8ba7c9](https://github.com/rxb3rth/nuxt-feature-flags/commit/c8ba7c9))
- Add Nitro plugin and utility functions for feature flags handling ([8ba1a6c](https://github.com/rxb3rth/nuxt-feature-flags/commit/8ba1a6c))
- Refactor feature flags handling and improve context management ([e8f9ec8](https://github.com/rxb3rth/nuxt-feature-flags/commit/e8f9ec8))
- Simplify feature flags configuration and remove unused context handling ([c68a9c7](https://github.com/rxb3rth/nuxt-feature-flags/commit/c68a9c7))
- Remove unused feature flags context file ([d621ae4](https://github.com/rxb3rth/nuxt-feature-flags/commit/d621ae4))
- Rename useFeatureFlags to useClientFlags and add useServerFlags for server-side flag handling ([3a45d8f](https://github.com/rxb3rth/nuxt-feature-flags/commit/3a45d8f))
- Update logging in server middleware to use correct feature flag names ([7f507a1](https://github.com/rxb3rth/nuxt-feature-flags/commit/7f507a1))
- Remove async from nitro plugin definition for improved performance ([3372a11](https://github.com/rxb3rth/nuxt-feature-flags/commit/3372a11))
- Enhance feature flags module with caching and dynamic resolution from config file ([6a1ea44](https://github.com/rxb3rth/nuxt-feature-flags/commit/6a1ea44))
- Add configuration files for feature flags and context management ([ac3b1b8](https://github.com/rxb3rth/nuxt-feature-flags/commit/ac3b1b8))
- Simplify flag resolution in nitro plugin by removing context handling ([9dacb95](https://github.com/rxb3rth/nuxt-feature-flags/commit/9dacb95))
- Update getFlags function to return nested feature flags structure ([34de6ae](https://github.com/rxb3rth/nuxt-feature-flags/commit/34de6ae))
- Refactor feature flags implementation and improve configuration handling ([585b541](https://github.com/rxb3rth/nuxt-feature-flags/commit/585b541))
- Remove unused dependency 'pathe' from package.json and pnpm-lock.yaml ([b8701aa](https://github.com/rxb3rth/nuxt-feature-flags/commit/b8701aa))
- Enhance feature flags configuration with nested structure and optional inheritance ([39cd407](https://github.com/rxb3rth/nuxt-feature-flags/commit/39cd407))

### 💅 Refactors

- Update module options to use FeatureFlagsConfig type ([6e19e40](https://github.com/rxb3rth/nuxt-feature-flags/commit/6e19e40))
- Remove TypeScript ignore comments and assert featureFlags type ([592c758](https://github.com/rxb3rth/nuxt-feature-flags/commit/592c758))

### 📖 Documentation

- Remove function from nuxt config ([ceffedb](https://github.com/rxb3rth/nuxt-feature-flags/commit/ceffedb))
- Update README to reflect static and dynamic flag evaluation, and add server composables section ([01060aa](https://github.com/rxb3rth/nuxt-feature-flags/commit/01060aa))

### 🏡 Chore

- Remove unused .nuxtrc configuration file ([0da7aef](https://github.com/rxb3rth/nuxt-feature-flags/commit/0da7aef))
- Add defu dependency to package.json and update pnpm-lock.yaml ([804b68e](https://github.com/rxb3rth/nuxt-feature-flags/commit/804b68e))
- **release:** V0.0.2 ([7430a69](https://github.com/rxb3rth/nuxt-feature-flags/commit/7430a69))
- Remove test job from CI workflow ([1f3e4b6](https://github.com/rxb3rth/nuxt-feature-flags/commit/1f3e4b6))

### ❤️ Contributors

- Daniel Roe ([@danielroe](http://github.com/danielroe))
- Roberth González <reliutg@gmail.com>

## v0.0.2


### 💅 Refactors

- Update module options to use FeatureFlagsConfig type ([6e19e40](https://github.com/rxb3rth/nuxt-feature-flags/commit/6e19e40))
- Remove TypeScript ignore comments and assert featureFlags type ([592c758](https://github.com/rxb3rth/nuxt-feature-flags/commit/592c758))

### 🏡 Chore

- Remove unused .nuxtrc configuration file ([0da7aef](https://github.com/rxb3rth/nuxt-feature-flags/commit/0da7aef))
- Add defu dependency to package.json and update pnpm-lock.yaml ([804b68e](https://github.com/rxb3rth/nuxt-feature-flags/commit/804b68e))

### ❤️ Contributors

- Roberth González <reliutg@gmail.com>

