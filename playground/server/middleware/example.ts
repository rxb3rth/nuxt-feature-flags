export default defineEventHandler((event) => {
  const { isEnabled, get, flags } = useServerFlags(event)
  console.log('New request: ' + getRequestURL(event))
  console.log('newDashboard', isEnabled('newDashboard'))
  console.log('isAdmin', get('isAdmin'))
  console.log('flags', flags)
})
