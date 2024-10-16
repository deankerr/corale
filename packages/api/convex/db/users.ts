import { omit, pick } from 'convex-helpers'
import { nullable, partial } from 'convex-helpers/validators'
import { ConvexError, v } from 'convex/values'

import { internalMutation, mutation, query } from '../functions'
import { generateRandomString } from '../lib/utils'
import { userFields } from '../schema'

import type { Id } from '../_generated/dataModel'
import type { QueryCtx } from '../types'
import type { Infer } from 'convex/values'

export const userReturnFieldsPublic = v.object({
  _id: v.id('users'),
  _creationTime: v.number(),
  ...pick(userFields, ['name', 'imageUrl', 'role']),
  isViewer: v.boolean(),
})

export const getUserPrivate = async (ctx: QueryCtx, userId: Id<'users'>) => {
  const user = await ctx.table('users').get(userId)
  if (!user) return null
  const isViewer = ctx.viewerId === user._id
  return { ...omit(user, ['tokenIdentifier']), isViewer }
}

export const getUserPublic = async (
  ctx: QueryCtx,
  userId: Id<'users'>,
): Promise<Infer<typeof userReturnFieldsPublic> | null> => {
  const user = await ctx.table('users').get(userId)
  if (!user) return null

  return {
    ...pick(user.doc(), ['_id', '_creationTime', 'name', 'imageUrl', 'role']),
    isViewer: getUserIsViewer(ctx, userId),
  }
}

export const getUserPublicX = async (
  ctx: QueryCtx,
  userId: Id<'users'>,
): Promise<Infer<typeof userReturnFieldsPublic>> => {
  const user = await getUserPublic(ctx, userId)
  if (!user) throw new ConvexError({ message: 'invalid user id', xid: userId })
  return user
}

export const getUserIsViewer = (ctx: QueryCtx, userId: Id<'users'>) => {
  return ctx.viewerId ? ctx.viewerId === userId : false
}

const getUserBySchema = v.union(
  v.object({ id: v.id('users') }),
  v.object({ tokenIdentifier: v.string() }),
)

export const create = internalMutation({
  args: {
    fields: v.object({
      ...userFields,
      tokenIdentifier: v.string(),
    }),
  },
  handler: async (ctx, { fields }) => await ctx.table('users').insert({ ...fields }),
})

export const update = internalMutation({
  args: {
    by: getUserBySchema,
    fields: v.object(partial(userFields)),
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

// * Users API Keys
export const generateNewApiKey = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.viewerX()

    // invalidate all current keys
    await ctx
      .table('users_api_keys', 'userId', (q) => q.eq('userId', user._id))
      .map(async (apiKey) => {
        if (apiKey.valid) await apiKey.patch({ valid: false })
      })

    const secret = `sk_${generateRandomString(32)}`
    return await ctx.table('users_api_keys').insert({ secret, valid: true, userId: user._id })
  },
})

export const getViewer = query({
  args: {},
  handler: async (ctx) => {
    const viewer = await ctx.viewer()
    return viewer ? pick(viewer.doc(), ['_id', '_creationTime', 'name', 'imageUrl', 'role']) : null
  },
  returns: nullable(v.object(omit(userReturnFieldsPublic.fields, ['isViewer']))),
})
