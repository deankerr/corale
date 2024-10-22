import { mutation, query } from '../functions'
import { prepareUpdate } from '../lib/utils'
import { patternFields } from '../schema'
import { nullable, omit, partial, v } from '../values'
import { generateXID, getEntity, getEntityWriterX } from './helpers/xid'

const patternCreateFields = {
  ...partial(omit(patternFields, ['model'])),
  model: patternFields['model'],
}

export const patternReturnFields = {
  _id: v.id('patterns'),
  _creationTime: v.number(),
  ...patternFields,
  // fields
  xid: v.string(),
  updatedAt: v.number(),
  lastUsedAt: v.number(),
  userId: v.id('users'),
}

// * Queries
export const get = query({
  args: {
    patternId: v.string(),
  },
  handler: async (ctx, { patternId }) => {
    return await getEntity(ctx, 'patterns', patternId)
  },
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
  returns: nullable(v.array(v.object(patternReturnFields))),
})

// * Mutations
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
    fields: v.object(partial(patternFields)),
  },
  handler: async (ctx, { patternId, fields }) => {
    const pattern = await getEntityWriterX(ctx, 'patterns', patternId)

    const defaults = {
      name: '',
      description: '',
      instructions: '',
    }

    const updates = prepareUpdate(fields, defaults)
    return await pattern.patch(updates)
  },
})

export const remove = mutation({
  args: {
    patternId: v.string(),
  },
  handler: async (ctx, { patternId }) => {
    const pattern = await getEntityWriterX(ctx, 'patterns', patternId)
    return await pattern.delete()
  },
})
