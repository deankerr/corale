import { messagesEnt } from '../entities/messages/ent'
import { mutation, query } from '../functions'
import type { Doc, MutationCtx, WithoutSystemFields } from '../types'
import { literals, omit, v } from '../values'
import { updateKvMetadata, updateKvValidator } from './helpers/kvMetadata'
import { generateXID, getEntity, getEntityWriterX, getEntityX } from './helpers/xid'
import { messagePostCreate } from './tasks'

export const messageCreateFields = {
  ...omit(messagesEnt.validator.fields, ['runId']),
}

export const messageReturnFields = {
  // doc
  _id: v.id('messages'),
  _creationTime: v.number(),
  role: literals('system', 'assistant', 'user'),
  name: v.optional(v.string()),
  text: v.optional(v.string()),
  channel: v.optional(v.string()),
  kvMetadata: v.optional(v.record(v.string(), v.string())),
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
) => {
  const thread = await ctx.table('threads').getX(fields.threadId)

  const prev = await thread.edge('messages').order('desc').first()
  const series = prev ? prev.series + 1 : 1
  const xid = generateXID()

  const message = await ctx
    .table('messages')
    .insert({ ...fields, series, xid })
    .get()

  await messagePostCreate(ctx, message)

  return message
}

// * queries
export const get = query({
  args: {
    messageId: v.string(),
  },
  handler: async (ctx, { messageId }) => {
    const message = await getEntity(ctx, 'messages', messageId)
    return message ? message.doc() : null
  },
  returns: v.union(v.null(), v.object(messageReturnFields)),
})

// * mutations
export const create = mutation({
  args: {
    threadId: v.string(),
    fields: v.object(messageCreateFields),
  },
  handler: async (ctx, { threadId, fields }) => {
    const thread = await getEntityX(ctx, 'threads', threadId)

    const message = await createMessage(ctx, {
      ...fields,
      threadId: thread._id,
      userId: thread.userId,
    })

    return message.xid
  },
  returns: v.string(),
})

export const update = mutation({
  args: {
    messageId: v.string(),

    fields: v.object({
      role: v.optional(messagesEnt.validator.fields['role']),
      name: v.optional(v.string()),
      text: v.optional(v.string()),
      channel: v.optional(v.string()),
    }),
    updateKv: v.optional(updateKvValidator),
  },
  handler: async (ctx, { messageId, fields, updateKv }) => {
    const message = await getEntityWriterX(ctx, 'messages', messageId)

    if (fields.name === '') fields.name = undefined
    if (fields.text === '') fields.text = undefined
    if (fields.channel === '') fields.channel = undefined

    const kvMetadata = updateKvMetadata(message.kvMetadata, updateKv)

    await message.patch({ ...fields, kvMetadata })
    return message.xid
  },
  returns: v.string(),
})

export const remove = mutation({
  args: {
    messageId: v.string(),
  },
  handler: async (ctx, { messageId }) => {
    const message = await getEntityWriterX(ctx, 'messages', messageId)
    await message.delete()
  },
  returns: v.null(),
})
