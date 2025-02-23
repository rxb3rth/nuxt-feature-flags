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
