import type { H3Event } from 'h3'

export default (event?: H3Event) => {
  return {
    newDashboard: true,
    isAdmin: event?.context?.user?.isAdmin,
  }
}
