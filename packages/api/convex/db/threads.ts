import { threadsEnt } from '../entities/threads/ent'
import { mutation, query } from '../functions'
import type { EThread, Id, MutationCtx, QueryCtx } from '../types'
import { ConvexError, nullable, omit, pick, v } from '../values'
import { updateKvMetadata, updateKvValidator } from './helpers/kvMetadata'
import { generateXID, getEntity, getEntityWriterX } from './helpers/xid'
import { createMessage, messageCreateFields } from './messages'

// * Helpers
export const threadCreateFields = pick(threadsEnt.validator.fields, [
  'title',
  'instructions',
  'favourite',
  'kvMetadata',
])

export const threadReturnFields = {
  // doc
  _id: v.string(),
  _creationTime: v.number(),
  title: v.optional(v.string()),
  instructions: v.optional(v.string()),
  favourite: v.optional(v.boolean()),
  kvMetadata: v.optional(v.record(v.string(), v.string())),
  updatedAtTime: v.number(),
  // + fields
  xid: v.string(),
  userId: v.id('users'),
}

const getEmptyThread = async (ctx: QueryCtx): Promise<EThread | null> => {
  const userId = ctx.viewerId
  if (!userId) return null
  return {
    _id: 'new' as Id<'threads'>,
    _creationTime: Date.now(),
    xid: 'new',
    title: 'New Thread',

    updatedAtTime: Date.now(),
    userId,
  }
}

export const getOrCreateUserThread = async (ctx: MutationCtx, id?: string) => {
  const user = await ctx.viewerX()

  if (!id || id === 'new') {
    // * create thread
    const thread = await ctx
      .table('threads')
      .insert({
        userId: user._id,
        updatedAtTime: Date.now(),
        xid: generateXID(),
      })
      .get()

    return thread
  }

  const thread = await getEntityWriterX(ctx, 'threads', id)
  if (thread?.userId !== user._id || thread.deletionTime) return null
  return thread
}

// * Queries
export const get = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.id === 'new') {
      return await getEmptyThread(ctx)
    }

    const thread = await getEntity(ctx, 'threads', args.id)
    if (!thread || thread.deletionTime) return null

    return thread.doc()
  },
  returns: nullable(v.object(threadReturnFields)),
})

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = ctx.viewerId
    if (!userId) return null

    const threads = await ctx
      .table('threads', 'userId', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .map(async (thread) => thread.doc())

    return threads
  },
  returns: nullable(v.array(v.object(threadReturnFields))),
})

export const getTextStreams = query({
  args: {
    runId: v.id('runs'),
  },
  handler: async (ctx, { runId }) => {
    const run = await ctx.table('runs').get(runId)
    if (!run) return []

    const texts = await ctx
      .table('texts', 'runId', (q) => q.eq('runId', run._id))
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .map((text) => ({ content: text.content, _id: text._id }))
    return texts
  },
  returns: v.array(v.object({ content: v.string(), _id: v.id('texts') })),
})

// * Mutations
export const create = mutation({
  args: threadCreateFields,
  handler: async (ctx, args) => {
    const user = await ctx.viewerX()
    const xid = generateXID()
    await ctx.table('threads').insert({
      ...args,
      updatedAtTime: Date.now(),
      userId: user._id,
      xid,
    })

    return xid
  },
  returns: v.string(),
})

export const update = mutation({
  args: {
    threadId: v.string(),
    fields: v.object(omit(threadsEnt.validator.fields, ['kvMetadata'])),
    updateKv: v.optional(updateKvValidator),
  },
  handler: async (ctx, { threadId, fields, updateKv }) => {
    const thread = await getEntityWriterX(ctx, 'threads', threadId)
    const kvMetadata = updateKvMetadata(thread.kvMetadata, updateKv)

    await thread.patch({ ...fields, kvMetadata, updatedAtTime: Date.now() })
    return thread.xid
  },
  returns: v.string(),
})

export const remove = mutation({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, { threadId }) => {
    const thread = await getEntityWriterX(ctx, 'threads', threadId)
    await thread.delete()
  },
  returns: v.null(),
})

// * append message
export const append = mutation({
  args: {
    threadId: v.optional(v.string()),
    message: v.object(messageCreateFields),
  },
  handler: async (ctx, { threadId, message }) => {
    const thread = await getOrCreateUserThread(ctx, threadId)
    if (!thread) throw new ConvexError('invalid thread')

    await createMessage(ctx, {
      threadId: thread._id,
      userId: thread.userId,
      ...message,
    })

    return thread.xid
  },
  returns: v.string(),
})
