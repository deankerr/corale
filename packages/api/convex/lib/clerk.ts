import { createClerkClient } from '@clerk/backend'
import type { User, UserJSON, WebhookEvent } from '@clerk/nextjs/server'
import { ConvexError } from 'convex/values'
import { Webhook } from 'svix'
import { internal } from '../_generated/api'
import { httpAction, internalAction } from '../_generated/server'
import { ENV } from './env'
import { generateRandomString } from './utils'

export const handleWebhook = httpAction(async (ctx, request) => {
  const webhookSecret = ENV.CLERK_WEBHOOK_SECRET
  const issuerDomain = ENV.CLERK_JWT_ISSUER_DOMAIN

  try {
    const svix_id = request.headers.get('svix-id') ?? ''
    const svix_timestamp = request.headers.get('svix-timestamp') ?? ''
    const svix_signature = request.headers.get('svix-signature') ?? ''

    const payload = await request.text()
    const wh = new Webhook(webhookSecret)

    const event = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent

    switch (event.type) {
      case 'user.created':
        await ctx.runMutation(internal.entities.users.action.create, {
          fields: getUserJsonFields(event.data),
        })
        break

      case 'user.updated':
        const { imageUrl } = getUserJsonFields(event.data)
        await ctx.runMutation(internal.entities.users.action.update, {
          tokenIdentifier: `${issuerDomain}|${event.data.id}`,
          fields: {
            imageUrl,
          },
        })
        break

      case 'user.deleted':
        await ctx.runMutation(internal.entities.users.action.remove, {
          tokenIdentifier: `${issuerDomain}|${event.data.id}`,
        })
        break

      default:
        throw new ConvexError({ message: 'Unhandled result type', type: event.type })
    }

    return new Response('OK', { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response('Error', {
      status: 400,
    })
  }
})

export const importUsers = internalAction(async (ctx) => {
  const secretKey = ENV.CLERK_SECRET_KEY

  const clerkClient = createClerkClient({ secretKey })
  const users = await clerkClient.users.getUserList()

  for (const user of users.data) {
    const fields = getUserFields(user)

    const existingUser = await ctx.runQuery(internal.entities.users.action.getByTokenIdentifier, {
      tokenIdentifier: fields.tokenIdentifier,
    })
    if (existingUser) continue

    const _id = await ctx.runMutation(internal.entities.users.action.create, {
      fields,
    })
    await ctx.runMutation(internal.entities.users.keys.generateApiKeyForUser, { userId: _id })
  }
})

function getUserFields(user: User) {
  const { id, username, imageUrl, firstName, publicMetadata } = user

  const issuerDomain = ENV.CLERK_JWT_ISSUER_DOMAIN
  const tokenIdentifier = `${issuerDomain}|${id}`

  const name = username || firstName || `User_${generateRandomString(10)}`
  const role = (publicMetadata?.role as 'user' | 'admin' | undefined) || 'user'

  return { tokenIdentifier, name, role, imageUrl }
}

function getUserJsonFields(user: UserJSON) {
  const { id, username, image_url, first_name, public_metadata } = user

  const issuerDomain = ENV.CLERK_JWT_ISSUER_DOMAIN
  const tokenIdentifier = `${issuerDomain}|${id}`

  const name = username || first_name || `User_${generateRandomString(10)}`
  const role = (public_metadata?.role as 'user' | 'admin' | undefined) || 'user'

  return { tokenIdentifier, name, role, imageUrl: image_url }
}
