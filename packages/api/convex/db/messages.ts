import { internal } from '../_generated/api'
import { mutation, query } from '../functions'
import { extractValidUrlsFromText } from '../lib/utils'
import { messageFields } from '../schema'
import type { Doc, Ent, Id, MutationCtx, QueryCtx, WithoutSystemFields } from '../types'
import { literals, nullable, omit, v } from '../values'
import { updateKvMetadata, updateKvValidator } from './helpers/kvMetadata'
import { generateXID, getEntityX } from './helpers/xid'

export const messageCreateFields = {
  ...omit(messageFields, ['runId']),
}

export const messageReturnFields = {
  // doc
  _id: v.id('messages'),
  _creationTime: v.number(),
  role: literals('system', 'assistant', 'user'),
  name: v.optional(v.string()),
  text: v.optional(v.string()),
  channel: v.optional(v.string()),
  kvMetadata: v.record(v.string(), v.string()),
  runId: v.optional(v.id('runs')),

  // fields
  xid: v.string(),
  series: v.number(),
  threadId: v.string(),
  userId: v.id('users'),
}

// * query helpers

export const createMessage = async (
  ctx: MutationCtx,
  fields: Omit<WithoutSystemFields<Doc<'messages'>>, 'series' | 'deletionTime' | 'xid'>,
  options?: {
    skipRules?: boolean
    evaluateUrls?: boolean
    generateThreadTitle?: boolean
  },
) => {
  const skipRules = options?.skipRules ?? false
  const evaluateUrls = options?.evaluateUrls ?? fields.role === 'user'
  const generateThreadTitle = options?.generateThreadTitle ?? fields.role === 'assistant'

  const thread = await ctx.skipRules.table('threads').getX(fields.threadId)

  const prev = await thread.edge('messages').order('desc').first()
  const series = prev ? prev.series + 1 : 1
  const xid = generateXID()

  const message = skipRules
    ? await ctx.skipRules
        .table('messages')
        .insert({ ...fields, series, xid })
        .get()
    : await ctx
        .table('messages')
        .insert({ ...fields, series, xid })
        .get()

  if (evaluateUrls) {
    if (message.text) {
      const urls = extractValidUrlsFromText(message.text)

      if (urls.length > 0) {
        await ctx.scheduler.runAfter(0, internal.action.evaluateMessageUrls.run, {
          urls: urls.map((url) => url.toString()),
          ownerId: message.userId,
        })
      }
    }
  }

  if (generateThreadTitle && !thread.title) {
    await ctx.scheduler.runAfter(0, internal.action.generateThreadTitle.run, {
      threadId: thread._id,
    })
  }

  return message
}

export const getMessageEdges = async (ctx: QueryCtx, message: Ent<'messages'>) => {
  return {
    ...message.doc(),
    kvMetadata: message.kvMetadata ?? {},
  }
}

// * queries
export const get = query({
  args: {
    messageId: v.string(),
  },
  handler: async (ctx, args) => {
    const id = ctx.table('messages').normalizeId(args.messageId)
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
  returns: nullable(v.object(messageReturnFields)),
})

// * mutations
export const create = mutation({
  args: {
    threadId: v.string(),
    ...messageCreateFields,
  },
  handler: async (ctx, { threadId, ...fields }) => {
    const thread = await getEntityX(ctx, 'threads', threadId)

    const message = await createMessage(ctx, {
      ...fields,
      threadId: thread._id,
      userId: thread.userId,
    })

    return {
      threadId: thread.xid,
      id: message._id,
      series: message.series,
    }
  },
  returns: v.object({
    threadId: v.string(),
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
  },
  returns: v.null(),
})
