import { omit, pick } from 'convex-helpers'
import { nullable } from 'convex-helpers/validators'
import { ConvexError, v, type AsObjectValidator, type Infer } from 'convex/values'
import type { Id } from '../_generated/dataModel'
import { mutation, query } from '../functions'
import { threadFields } from '../schema'
import type { Ent, EThread, MutationCtx, QueryCtx } from '../types'
import { updateKvMetadata, updateKvValidator } from './helpers/kvMetadata'
import { generateXID, getEntity, getEntityWriterX } from './helpers/xid'
import { createMessage, messageCreateFields } from './messages'
import { getUserPublic, getUserPublicX, userReturnFieldsPublic } from './users'

// * Helpers
export const threadCreateFields = pick(threadFields, ['title', 'instructions', 'favourite', 'kvMetadata'])

export const threadReturnFields = {
  // doc
  _id: v.string(),
  _creationTime: v.number(),
  title: v.optional(v.string()),
  instructions: v.optional(v.string()),
  favourite: v.optional(v.boolean()),
  kvMetadata: v.record(v.string(), v.string()),
  updatedAtTime: v.number(),
  // + fields
  xid: v.string(),
  userId: v.id('users'),

  // edge
  user: userReturnFieldsPublic,
}

export const getThreadEdges = async (
  ctx: QueryCtx,
  thread: Ent<'threads'>,
): Promise<Infer<AsObjectValidator<typeof threadReturnFields>>> => {
  return {
    ...thread,
    user: await getUserPublicX(ctx, thread.userId),
    kvMetadata: thread.kvMetadata ?? {},
  }
}

const getEmptyThread = async (ctx: QueryCtx): Promise<EThread | null> => {
  const viewer = await ctx.viewer()
  const user = viewer ? await getUserPublic(ctx, viewer._id) : null
  if (!user) return null

  return {
    _id: 'new' as Id<'threads'>,
    _creationTime: Date.now(),
    xid: 'new',
    title: 'New Thread',

    updatedAtTime: Date.now(),
    userId: user._id,
    user,
    kvMetadata: {},
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

    return await getThreadEdges(ctx, thread)
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
      .map(async (thread) => await getThreadEdges(ctx, thread))

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
    ...omit(threadFields, ['updatedAtTime', 'kvMetadata']),
    threadId: v.string(),
    updateKv: v.optional(updateKvValidator),
  },
  handler: async (ctx, { threadId, updateKv, ...fields }) => {
    const thread = await getEntityWriterX(ctx, 'threads', threadId)
    const kvMetadata = updateKvMetadata(thread.kvMetadata, updateKv)

    return await ctx
      .table('threads')
      .getX(thread._id)
      .patch({ ...fields, kvMetadata, updatedAtTime: Date.now() })
  },
  returns: v.id('threads'),
})

export const remove = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const thread = await getEntityWriterX(ctx, 'threads', args.id)
    await thread.delete()
  },
  returns: v.null(),
})

// * append message
export const append = mutation({
  args: {
    id: v.optional(v.string()),
    message: v.object(messageCreateFields),
  },
  handler: async (ctx, args) => {
    const thread = await getOrCreateUserThread(ctx, args.id)
    if (!thread) throw new ConvexError('invalid thread')

    await createMessage(ctx, {
      threadId: thread._id,
      userId: thread.userId,
      ...args.message,
    })

    return thread.xid
  },
  returns: v.string(),
})
