import { mutation, query } from '../../functions'
import { nullable, v } from '../../values'
import { TextPromptReturn } from './validators'

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
