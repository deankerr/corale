import { query } from '../../functions'
import { v } from '../../values'
import { ChatModelReturn } from './validators'

export const list = query({
  args: {},
  handler: async (ctx) => {
    const models = await ctx
      .table('chat_models')
      .filter((q) => q.and(q.eq(q.field('hidden'), false), q.eq(q.field('available'), true)))
      .map((model) => ({ ...model, description: '' }))

    return models.sort((a, b) => a.name.localeCompare(b.name))
  },
  returns: v.array(ChatModelReturn),
})
