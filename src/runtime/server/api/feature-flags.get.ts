import { eventHandler } from 'h3'
import { getFeatureFlags } from '../utils/feature-flags'

export default eventHandler(async (event) => {
  return getFeatureFlags(event)
})
