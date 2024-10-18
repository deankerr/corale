import { omit } from 'convex-helpers'
import { nullable } from 'convex-helpers/validators'
import { v } from 'convex/values'
import { internal } from '../_generated/api'
import type { Id } from '../_generated/dataModel'
import { internalMutation, mutation, query } from '../functions'
import { messageFields } from '../schema'
import { updateKvMetadata, updateKvValidator } from './helpers/kvMetadata'
import { createMessage, getMessageEdges, messageCreateFields, messageReturnFields } from './helpers/messages'
import { getThreadX } from './helpers/threads'

// * queries
export const get = query({
  args: {
    messageId: v.string(),
  },
  handler: async (ctx, args) => {
    const id = ctx.unsafeDb.normalizeId('messages', args.messageId)
    const message = id ? await ctx.table('messages').get(id) : null

    return message ? await getMessageEdges(ctx, message) : null
  },
  returns: v.union(v.null(), v.object(messageReturnFields)),
})

export const getDoc = query({
  args: {
    messageId: v.string(),
  },
  handler: async (ctx, args) => {
    const id = ctx.table('messages').normalizeId(args.messageId)
    const message = id ? await ctx.table('messages').get(id).doc() : null

    return message
      ? {
          ...message,
          kvMetadata: message.kvMetadata ?? {},
        }
      : null
  },
  returns: nullable(v.object(omit(messageReturnFields, ['threadSlug']))),
})

// * mutations
export const create = mutation({
  args: {
    threadId: v.string(),
    ...messageCreateFields,
  },
  handler: async (ctx, { threadId, ...fields }) => {
    const thread = await getThreadX(ctx, threadId)

    const message = await createMessage(ctx, {
      ...fields,
      threadId: thread._id,
      userId: thread.userId,
    })

    return {
      threadId: thread._id,
      slug: thread.slug,
      id: message._id,
      series: message.series,
    }
  },
  returns: v.object({
    threadId: v.id('threads'),
    slug: v.string(),
    id: v.id('messages'),
    series: v.number(),
  }),
})

export const update = mutation({
  args: {
    messageId: v.id('messages'),

    role: v.optional(messageFields.role),
    name: v.optional(v.string()),
    text: v.optional(v.string()),

    channel: v.optional(v.string()),
    updateKv: v.optional(updateKvValidator),
  },
  handler: async (ctx, { messageId, updateKv, ...args }) => {
    const message = await ctx.table('messages').getX(messageId)

    if (args.name === '') args.name = undefined
    if (args.text === '') args.text = undefined
    if (args.channel === '') args.channel = undefined

    const kvMetadata = updateKvMetadata(message.kvMetadata, updateKv)

    return await ctx
      .table('messages')
      .getX(messageId)
      .patch({ ...args, kvMetadata })
  },
  returns: v.id('messages'),
})

export const remove = mutation({
  args: {
    messageId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx
      .table('messages')
      .getX(args.messageId as Id<'messages'>)
      .delete()

    await ctx.scheduler.runAfter(0, internal.deletion.scheduleFileDeletion, {})
  },
  returns: v.null(),
})
