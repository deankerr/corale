import { raise } from '../../lib/utils'
import type { Id, MutationCtx, QueryCtx } from '../../types'
import { ConvexError, type Infer } from '../../values'
import { generateXID, nullifyDeletedEnt, nullifyDeletedEntWriter } from '../helpers'
import { updateKvMetadata } from '../kvMetadata'
import { ThreadCreate, ThreadUpdate } from './validators'

// * queries
export async function getThread(ctx: QueryCtx, args: { threadId: string }) {
  const docId = ctx.table('threads').normalizeId(args.threadId)
  const thread = docId ? await ctx.table('threads').get(docId) : await ctx.table('threads').get('xid', args.threadId)
  return nullifyDeletedEnt(thread)
}

export async function getThreadX(ctx: QueryCtx, args: { threadId: string }) {
  const thread = await getThread(ctx, args)
  if (!thread) throw new ConvexError({ message: `Invalid thread id`, id: args.threadId })
  return thread
}

export async function getThreadWriter(ctx: MutationCtx, args: { threadId: string }) {
  const docId = ctx.table('threads').normalizeId(args.threadId)
  const thread = docId ? await ctx.table('threads').get(docId) : await ctx.table('threads').get('xid', args.threadId)
  return nullifyDeletedEntWriter(thread)
}

export async function getThreadWriterX(ctx: MutationCtx, args: { threadId: string }) {
  const thread = await getThreadWriter(ctx, args)
  if (!thread) throw new ConvexError({ message: `Invalid thread id`, id: args.threadId })
  return thread
}

// * mutations
export async function createThread(ctx: MutationCtx, fields: Infer<typeof ThreadCreate> & { userId?: Id<'users'> }) {
  const userId = fields.userId ?? ctx.viewerId ?? raise('No user ID provided')
  const xid = generateXID()

  const thread = await ctx
    .table('threads')
    .insert({ ...fields, xid, userId, updatedAtTime: Date.now() })
    .get()

  return thread
}

export async function updateThread(ctx: MutationCtx, { threadId, fields }: Infer<typeof ThreadUpdate>) {
  const thread = (await getThreadWriter(ctx, { threadId })) ?? raise('invalid thread id')
  const kvMetadata = updateKvMetadata(thread.kvMetadata, fields.kvMetadata)
  await thread.patch({ ...fields, kvMetadata, updatedAtTime: Date.now() })
  return thread.xid
}

export async function removeThread(ctx: MutationCtx, { threadId }: { threadId: string }) {
  const thread = (await getThreadWriter(ctx, { threadId })) ?? raise('invalid thread id')
  await thread.delete()
  return thread.xid
}
