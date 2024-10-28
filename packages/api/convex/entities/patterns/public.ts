import { mutation, query } from '../../functions'
import { prepareUpdate } from '../../lib/utils'
import { nullable, v } from '../../values'
import { generateXID } from '../helpers'
import { getPattern, getPatternWriterX } from './db'
import { PatternCreate, PatternReturn, PatternUpdate } from './validators'

// * Queries
export const get = query({
  args: {
    patternId: v.string(),
  },
  handler: async (ctx, { patternId }) => {
    return await getPattern(ctx, { patternId })
  },
  returns: nullable(PatternReturn),
})

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = ctx.viewerId
    if (!userId) return null
    return await ctx
      .table('patterns', 'userId', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
  },
  returns: nullable(v.array(PatternReturn)),
})

// * Mutations
export const create = mutation({
  args: PatternCreate,
  handler: async (
    ctx,
    {
      name = 'Untitled',
      description = '',
      instructions = '',
      initialMessages = [],
      dynamicMessages = [],
      kvMetadata = {},
      model,
    },
  ) => {
    const user = await ctx.viewerX()

    const xid = generateXID()
    await ctx.table('patterns').insert({
      name,
      description,
      instructions,
      initialMessages,
      dynamicMessages,
      kvMetadata,
      model,
      xid,
      userId: user._id,
      updatedAt: Date.now(),
      lastUsedAt: 0,
    })

    return xid
  },
  returns: v.string(),
})

export const update = mutation({
  args: {
    patternId: v.string(),
    fields: v.object(PatternUpdate),
  },
  handler: async (ctx, { patternId, fields }) => {
    const pattern = await getPatternWriterX(ctx, { patternId })

    const defaults = {
      name: '',
      description: '',
      instructions: '',
    }

    const updates = prepareUpdate(fields, defaults)
    await pattern.patch(updates)
    return pattern.xid
  },
  returns: v.string(),
})

export const remove = mutation({
  args: {
    patternId: v.string(),
  },
  handler: async (ctx, { patternId }) => {
    const pattern = await getPatternWriterX(ctx, { patternId })
    await pattern.delete()
    return pattern.xid
  },
  returns: v.string(),
})
