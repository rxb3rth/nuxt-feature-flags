import type { FlagsSchema } from '#build/types/nuxt-feature-flags'

export default defineEventHandler(async (event) => {
  event.context.user = {
    role: 'admin',
  }

  const { isEnabled, get, flags } = await useServerFlags<FlagsSchema>(event)
  console.log('New request: ' + getRequestURL(event))
  console.log('newDashboard.isEnabled', isEnabled('newDashboard'))
  console.log('newDashboard.get', get('newDashboard'))
  console.log('flags', flags)

  return flags
})
