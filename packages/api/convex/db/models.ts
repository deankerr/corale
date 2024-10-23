import { chatModelSchemaFields } from '../entities/chatModels'
import { internalMutation, internalQuery, query } from '../functions'
import { QueryCtx } from '../types'
import { partial, v, withSystemFields } from '../values'

export const chatModelReturn = v.object({
  ...withSystemFields('chat_models', chatModelSchemaFields),
  resourceKey: v.string(),
})

export const getChatModel = async (ctx: QueryCtx, modelId: string) => {
  const model = await ctx
    .table('chat_models')
    .filter((q) => q.eq(q.field('modelId'), modelId))
    .first()
  return model
}

export const list = query({
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

export const create = internalMutation({
  args: {
    ...chatModelSchemaFields,
    resourceKey: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.table('chat_models').insert(args)
  },
})

export const replace = internalMutation({
  args: {
    id: v.id('chat_models'),
    ...chatModelSchemaFields,
    resourceKey: v.string(),
  },
  handler: async (ctx, { id, ...args }) => {
    return await ctx.table('chat_models').getX(id).replace(args)
  },
})

export const update = internalMutation({
  args: {
    id: v.id('chat_models'),
    fields: v.object(partial(chatModelSchemaFields)),
  },
  handler: async (ctx, { id, fields }) => {
    return await ctx.table('chat_models').getX(id).patch(fields)
  },
})
