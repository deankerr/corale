import { internalMutation, internalQuery } from '../../functions'
import { getViewerIdFromApiKey } from '../../rules'
import { nullable, partial, v } from '../../values'
import { getUserX } from './db'
import { UserReturn, UserSchemaFields } from './validators'

export const getByTokenIdentifier = internalQuery({
  args: {
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, { tokenIdentifier }) =>
    await ctx.table('users').get('tokenIdentifier', tokenIdentifier),
})

export const getViewerWithApiKey = internalQuery({
  args: {
    apiKey: v.optional(v.string()),
  },
  handler: async (ctx, { apiKey }) => {
    const apiKeyViewerId = await getViewerIdFromApiKey(ctx, apiKey)
    if (apiKeyViewerId) return await getUserX(ctx, apiKeyViewerId)

    const viewerId = ctx.viewerId
    if (viewerId) return await getUserX(ctx, viewerId)

    return null
  },
  returns: nullable(UserReturn),
})

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
    tokenIdentifier: v.string(),
    fields: v.object(partial(UserSchemaFields)),
  },
  handler: async (ctx, { tokenIdentifier, fields }) => {
    console.info('user updated', tokenIdentifier, fields.name, fields.role)
    return await ctx.table('users').getX('tokenIdentifier', tokenIdentifier).patch(fields)
  },
})

export const remove = internalMutation({
  args: {
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, { tokenIdentifier }) => {
    console.info('user removed', tokenIdentifier)
    return await ctx.table('users').getX('tokenIdentifier', tokenIdentifier).delete()
  },
})
