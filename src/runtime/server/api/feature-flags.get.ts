import { eventHandler } from 'h3'
import { useServerFlags } from '../composables'

export default eventHandler(async (event) => {
  return await useServerFlags(event)
})
