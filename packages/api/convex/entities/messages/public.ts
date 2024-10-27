import { mutation, query } from '../../functions'
import { nullable, v } from '../../values'
import { nullifyDeletedEnt } from '../helpers'
import { getThread } from '../threads/db'
import type { Message } from '../types'
import { createMessage, getMessage, removeMessage, updateMessage } from './db'
import { MessageCreate, MessageReturn, MessageUpdate } from './validators'

// * queries
export const get = query({
  args: {
    messageId: v.string(),
  },
  handler: async (ctx, args): Promise<Message | null> => await getMessage(ctx, args),
  returns: nullable(MessageReturn),
})

export const getSeries = query({
  args: {
    threadId: v.string(),
    series: v.number(),
  },
  handler: async (ctx, args): Promise<Message | null> => {
    const thread = await getThread(ctx, { threadId: args.threadId })
    if (!thread) return null

    const message = await ctx
      .table('messages', 'threadId_series', (q) => q.eq('threadId', thread._id).eq('series', args.series))
      .first()
    return nullifyDeletedEnt(message)
  },
  returns: nullable(MessageReturn),
})

// * mutations
export const create = mutation({
  args: MessageCreate,
  handler: async (ctx, args): Promise<string> => {
    const message = await createMessage(ctx, args)
    return message.xid
  },
  returns: v.string(),
})

export const update = mutation({
  args: MessageUpdate,
  handler: async (ctx, args): Promise<string> => await updateMessage(ctx, args),
  returns: v.string(),
})

export const remove = mutation({
  args: { messageId: v.string() },
  handler: async (ctx, args): Promise<string> => await removeMessage(ctx, args),
  returns: v.string(),
})
