import { internalMutation } from '../../functions'
import { ConvexError, v } from '../../values'

export const createMessageText = internalMutation({
  args: {
    runId: v.id('runs'),
    userId: v.id('users'),
  },
  handler: async (ctx, { runId, userId }) => {
    return await ctx.skipRules.table('texts').insert({
      type: 'message',
      content: '',
      updatedAt: Date.now(),
      userId,
      runId,
    })
  },
})

export const streamToText = internalMutation({
  args: {
    textId: v.id('texts'),
    content: v.string(),
  },
  handler: async (ctx, { textId, content }) => {
    const text = await ctx.skipRules.table('texts').getX(textId)
    if (text.type !== 'message' || text.deletionTime) {
      throw new ConvexError('invalid stream message text target')
    }

    return await text.patch({ content })
  },
})

export const deleteText = internalMutation({
  args: {
    textId: v.id('texts'),
  },
  handler: async (ctx, { textId }) => {
    return await ctx.skipRules.table('texts').getX(textId).delete()
  },
})
