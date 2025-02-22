import { type H3Event, parseCookies } from 'h3'

export default function featureFlagsContext(event: H3Event) {
  return {
    user: event?.context.user,
    cookies: parseCookies(event),
    environment: process.env.NODE_ENV,
  }
}
