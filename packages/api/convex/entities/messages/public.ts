import { mutation, query } from '../../functions'
import { nullable, v } from '../../values'
import type { Message } from '../types'
import { createMessage, getMessage, removeMessage, updateMessage } from './db'
import { MessageCreate, MessageReturn, MessageUpdate } from './validators'

export const get = query({
  args: {
    messageId: v.string(),
  },
  handler: async (ctx, args): Promise<Message | null> => await getMessage(ctx, args),
  returns: nullable(MessageReturn),
})

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
