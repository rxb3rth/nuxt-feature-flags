import type { FlagsSchema } from '#build/module/nuxt-feature-flags'

export default defineEventHandler(async (event) => {
  event.context.user = {
    role: 'admin',
  }

  const { isEnabled, flags } = await useServerFlags<FlagsSchema>(event)
  console.log('New request: ' + getRequestURL(event))
  console.log('newDashboard.isEnabled', isEnabled('newDashboard'))
  console.log('flags', isEnabled('i'))

  return flags
})
