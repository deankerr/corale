import { mutation, query } from '../../functions'
import { nullable, v } from '../../values'
import { getChatModel } from '../chatModels/db'
import type { Thread } from '../types'
import { createThread, getThread, removeThread, updateThread } from './db'
import { ThreadCreate, ThreadReturn, ThreadUpdate, ThreadWithDetailsReturn } from './validators'

// * queries
export const get = query({
  args: { threadId: v.string() },
  handler: async (ctx, args): Promise<Thread | null> => await getThread(ctx, args),
  returns: nullable(ThreadReturn),
})

export const listMy = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.viewer()
    if (!user) return null

    const threads = await user
      .edgeX('threads')
      .order('desc')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .map(async (thread) => {
        const modelId = thread.kvMetadata?.['esuite:model:id']
        const model = modelId ? await getChatModel(ctx, modelId) : null

        const latestMessage = await thread
          .edge('messages')
          .order('desc')
          .filter((q) => q.eq(q.field('deletionTime'), undefined))
          .first()
          .then((message) => (message ? { ...message, text: message?.text?.slice(0, 120) } : undefined))

        return {
          ...thread.doc(),
          model: model
            ? {
                modelId: model.modelId,
                name: model.name,
                creatorName: model.creatorName,
              }
            : undefined,
          latestMessage,
          // pleaseerror: 'ok',
        }
      })

    return threads
  },
  returns: nullable(v.array(ThreadWithDetailsReturn)),
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
