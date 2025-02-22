export default defineEventHandler((event) => {
  event.context.featureFlagsConfig = {
    flags: {
      'test-flag': true,
    },
  }

  console.log('New request: ' + getRequestURL(event))
})
