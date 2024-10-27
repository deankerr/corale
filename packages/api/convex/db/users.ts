import { UserReturn, UserSchemaFields } from '../entities/users/validators'
import { internalMutation, internalQuery, mutation, query } from '../functions'
import { generateRandomString } from '../lib/utils'
import { getViewerIdFromApiKey } from '../rules'
import type { Id, MutationCtx, QueryCtx } from '../types'
import { ConvexError, nullable, partial, pick, v } from '../values'

export const getUserPublic = async (ctx: QueryCtx, userId: Id<'users'>) => {
  const user = await ctx.table('users').get(userId)
  if (!user) return null

  return {
    ...pick(user.doc(), ['_id', '_creationTime', 'name', 'imageUrl', 'role']),
  }
}

export const getUserPublicX = async (ctx: QueryCtx, userId: Id<'users'>) => {
  const user = await getUserPublic(ctx, userId)
  if (!user) throw new ConvexError({ message: 'invalid user id', xid: userId })
  return user
}

export const getViewer = query({
  args: {},
  handler: async (ctx) => {
    const viewer = await ctx.viewer()
    return viewer ? pick(viewer.doc(), ['_id', '_creationTime', 'name', 'imageUrl', 'role']) : null
  },
  returns: nullable(UserReturn),
})

export const getViewerWithApiKey = internalQuery({
  args: {
    apiKey: v.optional(v.string()),
  },
  handler: async (ctx, { apiKey }) => {
    const apiKeyViewerId = await getViewerIdFromApiKey(ctx, apiKey)
    if (apiKeyViewerId) return await getUserPublicX(ctx, apiKeyViewerId)

    const viewerId = ctx.viewerId
    if (viewerId) return await getUserPublicX(ctx, viewerId)

    return null
  },
  returns: nullable(UserReturn),
})

const getUserBySchema = v.union(v.object({ id: v.id('users') }), v.object({ tokenIdentifier: v.string() }))

export const create = internalMutation({
  args: {
    fields: v.object({
      ...UserSchemaFields,
      tokenIdentifier: v.string(),
    }),
  },
  handler: async (ctx, { fields }) => {
    const id = await ctx.table('users').insert({ ...fields })
    console.info('user created', id, fields.name, fields.role)
    return id
  },
})

export const update = internalMutation({
  args: {
    by: getUserBySchema,
    fields: v.object(partial(UserSchemaFields)),
  },
  handler: async (ctx, { by, fields }) => {
    if ('id' in by) return await ctx.table('users').getX(by.id).patch(fields)
    return await ctx.table('users').getX('tokenIdentifier', by.tokenIdentifier).patch(fields)
  },
})

export const remove = internalMutation({
  args: {
    by: getUserBySchema,
  },
  handler: async (ctx, { by }) => {
    if ('id' in by) return await ctx.table('users').getX(by.id).delete()
    return await ctx.table('users').getX('tokenIdentifier', by.tokenIdentifier).delete()
  },
})

export const getByTokenIdentifier = internalQuery({
  args: {
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, { tokenIdentifier }) => await ctx.table('users').get('tokenIdentifier', tokenIdentifier),
})

// * Users API Keys

async function refreshApiKey(ctx: MutationCtx, userId: Id<'users'>) {
  // invalidate all current keys
  await ctx
    .table('users_api_keys', 'userId', (q) => q.eq('userId', userId))
    .map(async (apiKey) => {
      if (apiKey.valid) await apiKey.patch({ valid: false })
    })

  const secret = `sk_${generateRandomString(32)}`
  const id = await ctx.table('users_api_keys').insert({ secret, valid: true, userId })
  console.info('api key created', id, secret)
  return { id, secret }
}

export const generateApiKeyForUser = internalMutation({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => await refreshApiKey(ctx, userId),
})

export const generateViewerApiKey = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.viewerX()
    return await refreshApiKey(ctx, user._id)
  },
})
