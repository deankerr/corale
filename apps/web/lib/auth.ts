import { auth } from '@clerk/nextjs/server'

export async function getAuthToken() {
  const authed = await auth()
  const token = await authed.getToken({ template: 'convex' })
  return token
}
