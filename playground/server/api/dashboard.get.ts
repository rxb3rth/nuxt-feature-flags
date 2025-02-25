export default defineEventHandler(async (event) => {
  event.context.user = {
    role: 'admin',
  }

  const { isEnabled, flags } = await useServerFlags(event)
  console.log('New request: ' + getRequestURL(event))
  console.log('newDashboard.isEnabled', isEnabled('newDashboard'))
  console.log('isAdmin', isEnabled('isAdmin'))

  return flags
})
