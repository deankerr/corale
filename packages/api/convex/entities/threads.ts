import { mutation, query } from '../functions'
import { nullable, v } from '../values'
import { createThread, getThread, removeThread, updateThread } from './threads/db'
import { ThreadCreate, ThreadReturn, ThreadUpdate } from './threads/validators'
import type { Thread } from './types'

export const get = query({
  args: { threadId: v.string() },
  handler: async (ctx, args): Promise<Thread | null> => await getThread(ctx, args),
  returns: nullable(ThreadReturn),
})

export const create = mutation({
  args: ThreadCreate,
  handler: async (ctx, args): Promise<string> => {
    const thread = await createThread(ctx, args)
    return thread.xid
  },
  returns: v.string(),
})

export const update = mutation({
  args: ThreadUpdate,
  handler: async (ctx, args): Promise<string> => await updateThread(ctx, args),
  returns: v.string(),
})

export const remove = mutation({
  args: { threadId: v.string() },
  handler: async (ctx, args): Promise<string> => await removeThread(ctx, args),
  returns: v.string(),
})
