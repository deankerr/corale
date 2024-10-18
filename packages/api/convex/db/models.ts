import { partial } from 'convex-helpers/validators'
import { v } from 'convex/values'
import { internalMutation, internalQuery, query } from '../functions'
import { chatModelFields } from '../schema'
import { QueryCtx } from '../types'
import { withSystemFields } from '../values'

export const chatModelReturn = v.object(withSystemFields('chat_models', chatModelFields))

export const getChatModel = async (ctx: QueryCtx, modelId: string) => {
  const model = await ctx
    .table('chat_models')
    .filter((q) => q.eq(q.field('modelId'), modelId))
    .first()
  return model
}

export const listChatModels = query({
  args: {},
  handler: async (ctx) => {
    const models = await ctx
      .table('chat_models')
      .filter((q) => q.and(q.eq(q.field('hidden'), false), q.eq(q.field('available'), true)))
      .map((model) => ({ ...model, description: '' }))

    return models.sort((a, b) => a.name.localeCompare(b.name))
  },
  returns: v.array(chatModelReturn),
})

export const listAll = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.table('chat_models')
  },
})

export const createChatModel = internalMutation({
  args: {
    ...chatModelFields,
    resourceKey: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.table('chat_models').insert(args)
  },
})

export const updateChatModel = internalMutation({
  args: {
    id: v.id('chat_models'),
    ...chatModelFields,
    resourceKey: v.string(),
  },
  handler: async (ctx, { id, ...args }) => {
    return await ctx.table('chat_models').getX(id).replace(args)
  },
})

export const update = internalMutation({
  args: {
    id: v.id('chat_models'),
    fields: v.object(partial(chatModelFields)),
  },
  handler: async (ctx, { id, fields }) => {
    return await ctx.table('chat_models').getX(id).patch(fields)
  },
})
