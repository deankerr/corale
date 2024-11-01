import { ConvexError } from 'convex/values'
import { internal } from '../../_generated/api'
import { parseURLsFromText } from '../../lib/parse'
import { raise } from '../../lib/utils'
import type { Ent, Id, MutationCtx, QueryCtx } from '../../types'
import type { Infer } from '../../values'
import { generateXID, nullifyDeletedEnt, nullifyDeletedEntWriter } from '../helpers'
import { updateKvMetadata } from '../kvMetadata'
import { getThreadX } from '../threads/db'
import { MessageCreate, type MessageUpdate } from './validators'

// * helpers
async function processMessageURLs(ctx: MutationCtx, message: Ent<'messages'>) {
  if (!message.text || message.role !== 'user') return
  const urls = parseURLsFromText(message.text)

  if (urls.length > 0) {
    await ctx.scheduler.runAfter(0, internal.action.evaluateMessageUrls.run, {
      urls: urls.map((url) => url.toString()),
      ownerId: message.userId,
    })
  }
}

// * queries
export async function getMessage(ctx: QueryCtx, { messageId }: { messageId: string }) {
  const docId = ctx.table('messages').normalizeId(messageId)
  const message = docId ? await ctx.table('messages').get(docId) : await ctx.table('messages').get('xid', messageId)
  return nullifyDeletedEnt(message)
}

export async function getMessageX(ctx: QueryCtx, { messageId }: { messageId: string }) {
  const message = await getMessage(ctx, { messageId })
  if (!message || message.deletionTime) throw new ConvexError({ message: `Invalid message id`, id: messageId })
  return message
}

export async function getMessageWriter(ctx: MutationCtx, { messageId }: { messageId: string }) {
  const docId = ctx.table('messages').normalizeId(messageId)
  const message = docId ? await ctx.table('messages').get(docId) : await ctx.table('messages').get('xid', messageId)
  return nullifyDeletedEntWriter(message)
}

export async function getMessageWriterX(ctx: MutationCtx, { messageId }: { messageId: string }) {
  const message = await getMessageWriter(ctx, { messageId })
  if (!message || message.deletionTime) throw new ConvexError({ message: `Invalid message id`, id: messageId })
  return message
}

// * mutations
export async function createMessage(ctx: MutationCtx, fields: Infer<typeof MessageCreate> & { userId?: Id<'users'> }) {
  const thread = await getThreadX(ctx, { threadId: fields.threadId })
  const userId = fields.userId ?? ctx.viewerId ?? raise('No user ID provided')

  const prev = await thread.edge('messages').order('desc').first()
  const series = prev ? prev.series + 1 : 1
  const xid = generateXID()

  const message = await ctx
    .table('messages')
    .insert({ ...fields, series, xid, userId, threadId: thread._id })
    .get()

  await processMessageURLs(ctx, message)

  return message
}

export async function updateMessage(ctx: MutationCtx, { messageId, fields }: Infer<typeof MessageUpdate>) {
  const message = (await getMessageWriter(ctx, { messageId })) ?? raise('invalid message id')

  if (fields.name === '') fields.name = undefined
  if (fields.text === '') fields.text = undefined
  if (fields.channel === '') fields.channel = undefined
  const kvMetadata = updateKvMetadata(message?.kvMetadata, fields.kvMetadata)

  await message.patch({ ...fields, kvMetadata })
  return message.xid
}

export async function removeMessage(ctx: MutationCtx, { messageId }: { messageId: string }) {
  const message = (await getMessageWriter(ctx, { messageId })) ?? raise('invalid message id')
  await message.delete()
  return message.xid
}
