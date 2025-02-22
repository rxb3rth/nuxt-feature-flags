export default defineEventHandler((event) => {
  const { isEnabled, get, flags } = useServerFlags(event)
  console.log('New request: ' + getRequestURL(event))
  console.log('newDashboard', isEnabled('test'))
  console.log('experimentalFeature', get('test'))
  console.log('flags', flags)
})
