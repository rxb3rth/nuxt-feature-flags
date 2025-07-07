import { defineFeatureFlags } from '#feature-flags/handler'

export default defineFeatureFlags((context) => {
  return {
    // Simple boolean flags
    isAdmin: context?.user?.role === 'admin',
    newDashboard: true,
    experimentalFeature: process.env.NODE_ENV === 'development',
    promoBanner: false,
    betaFeature: false,

    // Feature flag with A/B test variants
    abTestExample: {
      enabled: true,
      value: 'default',
      variants: [
        { name: 'control', weight: 50, value: 'original' },
        { name: 'treatment', weight: 50, value: 'new-design' },
      ],
    },

    // Feature flag with A/B/n test (multiple variants)
    buttonColor: {
      enabled: true,
      value: 'blue', // default value
      variants: [
        { name: 'blue', weight: 40 },
        { name: 'green', weight: 30, value: 'green' },
        { name: 'red', weight: 20, value: 'red' },
        { name: 'purple', weight: 10, value: 'purple' },
      ],
    },

    // Feature flag with uneven distribution
    premiumFeature: {
      enabled: true,
      variants: [
        { name: 'free', weight: 80, value: false },
        { name: 'premium', weight: 20, value: true },
      ],
    },

    // Feature flag for gradual rollout
    newCheckout: {
      enabled: true,
      variants: [
        { name: 'old', weight: 70, value: false },
        { name: 'new', weight: 30, value: true },
      ],
    },
  }
})
