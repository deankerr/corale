import { omit } from 'convex-helpers'
import { nullable, partial } from 'convex-helpers/validators'
import { v } from 'convex/values'
import { mutation, query } from '../functions'
import { prepareUpdate } from '../lib/utils'
import { patternFields } from '../schema'
import { getPattern, getPatternWriterX } from './helpers/patterns'
import { generateXid } from './helpers/xid'

export const patternReturnFields = {
  ...patternFields,
  _id: v.id('patterns'),
  _creationTime: v.number(),
  xid: v.string(),
  updatedAt: v.number(),
  lastUsedAt: v.number(),
  userId: v.id('users'),
}

// * Queries

export const get = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, { id }) => {
    return await getPattern(ctx, id).then((pattern) => pattern?.doc() ?? null)
  },
})

export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.viewer()
    if (!user) return null
    return await ctx
      .table('patterns', 'userId', (q) => q.eq('userId', user._id))
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
  },
  returns: nullable(v.array(v.object(patternReturnFields))),
})

// * Mutations

const patternCreateFields = {
  ...partial(omit(patternFields, ['model'])),
  model: patternFields['model'],
}

export const create = mutation({
  args: patternCreateFields,
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

    const patternXid = generateXid('pattern')

    const patternId = await ctx.table('patterns').insert({
      name,
      description,
      instructions,
      initialMessages,
      dynamicMessages,
      kvMetadata,
      model,
      xid: patternXid,
      userId: user._id,
      updatedAt: Date.now(),
      lastUsedAt: 0,
    })

    return { id: patternId, xid: patternXid }
  },
  returns: v.object({
    id: v.id('patterns'),
    xid: v.string(),
  }),
})

export const update = mutation({
  args: {
    id: v.string(),
    ...partial(patternFields),
  },
  handler: async (ctx, { id, ...args }) => {
    const pattern = await getPatternWriterX(ctx, id)

    const defaults = {
      name: '',
      description: '',
      instructions: '',
    }

    const updates = prepareUpdate(args, defaults)

    return await pattern.patch(updates)
  },
})

export const remove = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, { id }) => {
    const pattern = await getPatternWriterX(ctx, id)
    return await pattern.delete()
  },
})
