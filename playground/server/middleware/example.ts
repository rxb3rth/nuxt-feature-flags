export default defineEventHandler((event) => {
  const { isEnabled, get, flags } = useServerFlags(event)
  console.log('New request: ' + getRequestURL(event))
  console.log('newDashboard', isEnabled('experimentalFeature'))
  console.log('experimentalFeature', get('experimentalFeature'))
  console.log('flags', flags)
})
