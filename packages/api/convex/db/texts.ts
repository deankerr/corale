import { TextPromptReturn } from '../entities/texts/validators'
import { internalMutation, mutation, query } from '../functions'
import { ConvexError, nullable, v } from '../values'

export const getPrompt = query({
  args: {
    _id: v.string(),
  },
  handler: async (ctx, { _id }) => {
    const id = ctx.table('texts').normalizeId(_id)
    const text = id ? await ctx.table('texts').get(id) : null
    if (!text || text.type !== 'prompt' || text.deletionTime) {
      return null
    }

    return { ...text, type: 'prompt' as const, title: text.title ?? 'Untitled Prompt' }
  },
  returns: nullable(TextPromptReturn),
})

export const listPrompts = query({
  args: {},
  handler: async (ctx) => {
    const viewer = await ctx.viewerX()
    return await ctx
      .table('texts', 'userId_type', (q) => q.eq('userId', viewer._id).eq('type', 'prompt'))
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .map((text) => ({
        ...text,
        type: 'prompt' as const,
        title: text.title ?? 'Untitled Prompt',
      }))
  },
  returns: v.array(TextPromptReturn),
})

export const setPrompt = mutation({
  args: {
    _id: v.optional(v.id('texts')),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, { _id, title, content }) => {
    const viewer = await ctx.viewerX()

    if (_id) {
      return await ctx.table('texts').getX(_id).patch({ title, content, updatedAt: Date.now() })
    } else {
      return await ctx.table('texts').insert({
        title,
        content,
        type: 'prompt',
        userId: viewer._id,
        updatedAt: Date.now(),
      })
    }
  },
})

export const deletePrompt = mutation({
  args: {
    _id: v.id('texts'),
  },
  handler: async (ctx, { _id }) => {
    return await ctx.table('texts').getX(_id).delete()
  },
})

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
