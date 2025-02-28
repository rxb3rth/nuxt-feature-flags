import { defineFeatureFlagsConfig } from '../src/module'

export default defineFeatureFlagsConfig((context) => {
  return {
    isAdmin: context?.user?.role === 'admin',
    newDashboard: true,
    experimentalFeature: process.env.NODE_ENV === 'development',
    promoBanner: false,
    betaFeature: false,
  }
})
