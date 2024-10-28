import { internalMutation, internalQuery } from '../../functions'
import { partial, v } from '../../values'
import { ChatModelSchemaFields } from './validators'

export const listAll = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.table('chat_models')
  },
})

export const create = internalMutation({
  args: {
    ...ChatModelSchemaFields,
    resourceKey: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.table('chat_models').insert(args)
  },
})

export const replace = internalMutation({
  args: {
    id: v.id('chat_models'),
    ...ChatModelSchemaFields,
    resourceKey: v.string(),
  },
  handler: async (ctx, { id, ...args }) => {
    return await ctx.table('chat_models').getX(id).replace(args)
  },
})

export const update = internalMutation({
  args: {
    id: v.id('chat_models'),
    fields: v.object(partial(ChatModelSchemaFields)),
  },
  handler: async (ctx, { id, fields }) => {
    return await ctx.table('chat_models').getX(id).patch(fields)
  },
})
