import type { FlagsSchema } from '#build/types/nuxt-feature-flags'

export default defineEventHandler((event) => {
  const { isEnabled, get, flags } = useServerFlags<FlagsSchema>(event)
  console.log('New request: ' + getRequestURL(event))
  console.log('newDashboard.isEnabled', isEnabled('newDashboard'))
  console.log('newDashboard.get', get('newDashboard'))
  console.log('flags', flags)
})
