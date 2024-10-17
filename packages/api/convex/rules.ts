import { addEntRules } from 'convex-ents'
import type { Id } from './_generated/dataModel'
import { entDefinitions } from './schema'
import type { QueryCtx } from './types'

export function getEntDefinitionsWithRules(ctx: QueryCtx): typeof entDefinitions {
  return addEntRules(entDefinitions, {
    users_api_keys: {
      read: async (key) => {
        return key.userId === ctx.viewerId
      },
    },
    threads: {
      write: async ({ operation, ent: thread, value }) => {
        if (operation === 'create') return ctx.viewerId === value.userId
        return ctx.viewerId === thread.userId
      },
    },
    messages: {
      write: async ({ operation, ent: message, value }) => {
        if (operation === 'create') return ctx.viewerId === value.userId
        return ctx.viewerId === message.userId
      },
    },
    images_v2: {
      write: async ({ operation, ent: image, value }) => {
        if (operation === 'create') return ctx.viewerId === value.ownerId
        return ctx.viewerId === image.ownerId
      },
    },
    texts: {
      write: async ({ operation, ent: text, value }) => {
        if (operation === 'create') return ctx.viewerId === value.userId
        return ctx.viewerId === text.userId
      },
    },
  })
}

export async function getViewerIdFromAuth(
  ctx: Omit<QueryCtx, 'table' | 'viewerId' | 'viewer' | 'viewerX'>,
): Promise<Id<'users'> | null> {
  const user = await ctx.auth.getUserIdentity()
  if (!user) return null

  const viewer = await ctx.skipRules.table('users').get('tokenIdentifier', user.tokenIdentifier)
  if (!viewer) return null

  return viewer._id
}

export async function getViewerIdFromApiKey(
  ctx: Omit<QueryCtx, 'table' | 'viewerId' | 'viewer' | 'viewerX'>,
  apiKey?: string,
): Promise<Id<'users'> | null> {
  if (!apiKey) return null

  const userApiKey = await ctx.skipRules
    .table('users_api_keys', 'secret', (q) => q.eq('secret', apiKey))
    .filter((q) => q.and(q.eq(q.field('valid'), true), q.eq(q.field('deletionTime'), undefined)))
    .unique()
  if (!userApiKey) return null

  const viewer = await ctx.skipRules.table('users').get(userApiKey.userId)
  if (!viewer) return null

  return viewer._id
}
