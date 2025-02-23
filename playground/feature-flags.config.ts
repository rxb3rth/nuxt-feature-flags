import type { H3EventContext } from 'h3'

export default (context?: H3EventContext) => {
  return {
    // Server-side context available only on server, context will be undefined at the customer
    isAdmin: context?.user?.role === 'admin',
    newDashboard: true,
    experimentalFeature: process.env.NODE_ENV === 'development',
    promoBanner: false,
    betaFeature: false,
  }
}
