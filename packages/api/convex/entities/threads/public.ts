import { mutation, query } from '../../functions'
import { nullable, v } from '../../values'
import type { Thread } from '../types'
import { createThread, getThread, removeThread, updateThread } from './db'
import { ThreadCreate, ThreadReturn, ThreadUpdate } from './validators'

// * queries
export const get = query({
  args: { threadId: v.string() },
  handler: async (ctx, args): Promise<Thread | null> => await getThread(ctx, args),
  returns: nullable(ThreadReturn),
})

export const list = query({
  args: {},
  handler: async (ctx): Promise<Thread[] | null> => {
    const user = await ctx.viewer()
    if (!user) return null

    const threads = await user
      .edgeX('threads')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .map(async (thread) => thread.doc())

    return threads
  },
  returns: nullable(v.array(ThreadReturn)),
})

// * mutations
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
