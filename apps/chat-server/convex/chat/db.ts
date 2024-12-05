import { asyncMap, mutation, query, v } from '#common'
import { chat } from './helpers'
import { vCreateChatMessage, vRunsConfig, vThreadsTableSchema, vUpdateMessage } from './schemas'

// * create
export const createThread = mutation({
  args: {
    ...vThreadsTableSchema,
    messages: v.optional(v.array(vCreateChatMessage)),
  },
  handler: async (ctx, { messages = [], ...args }) => {
    const threadId = await chat.threads.create(ctx, args)

    for (const message of messages) {
      await chat.threads.createMessage(ctx, { ...message, threadId })
    }

    if (args.run) {
      await chat.threads.runCompletion(ctx, { threadId, run: args.run })
    }

    return threadId
  },
})

export const deleteThread = mutation({
  args: {
    threadId: v.id('threads'),
  },
  handler: async (ctx, args) => {
    return await chat.threads.delete(ctx, args)
  },
})

export const createMessage = mutation({
  args: {
    threadId: v.id('threads'),
    message: vCreateChatMessage,
    run: v.optional(v.object(vRunsConfig)),
  },
  handler: async (ctx, args) => {
    console.log('createMessage', args)

    const messageId = await chat.threads.createMessage(ctx, { ...args.message, threadId: args.threadId })

    if (args.run) {
      await chat.threads.runCompletion(ctx, { threadId: args.threadId, run: args.run })
    }

    return messageId
  },
})

export const updateMessage = mutation({
  args: {
    messageId: v.id('messages'),
    message: vUpdateMessage,
  },
  handler: async (ctx, args) => {
    return await chat.threads.updateMessage(ctx, args)
  },
})

export const deleteMessage = mutation({
  args: {
    messageId: v.id('messages'),
  },
  handler: async (ctx, args) => {
    return await chat.threads.deleteMessage(ctx, args)
  },
})

export const runThread = mutation({
  args: {
    threadId: v.id('threads'),
    run: v.object(vRunsConfig),
  },
  handler: async (ctx, args) => {
    return await chat.threads.runCompletion(ctx, args)
  },
})

// * list
export const listThreads = query({
  args: v.object({}),
  handler: async (ctx) => {
    const threads = await ctx.db.query('threads').take(100)

    return await asyncMap(threads, async (thread) => {
      if (thread.title) return thread
      const firstMessage = await chat.threads.getFirstMessage(ctx, thread._id)
      return {
        ...thread,
        title: firstMessage?.text?.slice(0, 100),
      }
    })
  },
})

export const listMessages = query({
  args: v.object({
    threadId: v.id('threads'),
    order: v.optional(v.literals('asc', 'desc')),
    limit: v.optional(v.number()),
    excludeSystem: v.optional(v.boolean()),
    excludeEmptyText: v.optional(v.boolean()),
  }),
  handler: async (ctx, args) => {
    return await ctx.db
      .query('messages')
      .withIndex('by_thread', (q) => q.eq('threadId', args.threadId))
      .order(args.order ?? 'desc')
      .filter((q) => {
        return q.and(
          args.excludeSystem ? q.neq(q.field('role'), 'system') : true,
          args.excludeEmptyText ? q.neq(q.field('text'), undefined) : true,
        )
      })
      .take(args.limit ?? 100)
  },
})

// * get
export const getThread = query({
  args: v.object({
    threadId: v.id('threads'),
  }),
  handler: async (ctx, args) => {
    const thread = await chat.threads.get(ctx, args.threadId)
    if (!thread || thread.title) return thread
    const firstMessage = await chat.threads.getFirstMessage(ctx, args.threadId)
    return {
      ...thread,
      title: firstMessage?.text?.slice(0, 100),
    }
  },
})
