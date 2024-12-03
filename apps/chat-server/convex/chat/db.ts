import { internal } from '#api'
import { asyncMap, mutation, query, v, type Id, type MutationCtx, type QueryCtx } from '#common'
import type { AsObjectValidator, Infer } from 'convex/values'
import { vCreateChatMessage, vRunsConfig, vThreadsTableSchema, vUpdateMessage } from './schemas'

export const chatHelpers = {
  async getThread(ctx: QueryCtx, threadId: Id<'threads'>) {
    return await ctx.db.get(threadId)
  },

  async requireThread(ctx: QueryCtx, threadId: Id<'threads'>) {
    const thread = await ctx.db.get(threadId)
    if (!thread) throw new Error('Thread not found')
    return thread
  },

  async createThread(ctx: MutationCtx, args: Infer<AsObjectValidator<typeof vThreadsTableSchema>>) {
    return await ctx.db.insert('threads', args)
  },

  async deleteThread(ctx: MutationCtx, args: { threadId: Id<'threads'> }) {
    await ctx.db.delete(args.threadId)
    const messages = await ctx.db
      .query('messages')
      .withIndex('by_thread', (q) => q.eq('threadId', args.threadId))
      .collect()
    await asyncMap(messages, async (m) => await ctx.db.delete(m._id))
  },

  async getFirstMessage(ctx: QueryCtx, threadId: Id<'threads'>) {
    return await ctx.db
      .query('messages')
      .withIndex('by_thread', (q) => q.eq('threadId', threadId))
      .order('asc')
      .first()
  },

  async getLatestMessage(ctx: QueryCtx, threadId: Id<'threads'>) {
    return await ctx.db
      .query('messages')
      .withIndex('by_thread', (q) => q.eq('threadId', threadId))
      .order('desc')
      .first()
  },

  async createMessage(ctx: MutationCtx, args: Infer<typeof vCreateChatMessage> & { threadId: Id<'threads'> }) {
    const prevMessage = await chatHelpers.getLatestMessage(ctx, args.threadId)
    const sequence = prevMessage ? prevMessage.sequence + 1 : 0

    return await ctx.db.insert('messages', {
      ...args,
      userMetadata: args.userMetadata ?? {},
      sequence,
    })
  },

  async createCompletionMessage(ctx: MutationCtx, args: { threadId: Id<'threads'> }) {
    const prevMessage = await chatHelpers.getLatestMessage(ctx, args.threadId)
    const sequence = prevMessage ? prevMessage.sequence + 1 : 0

    return await ctx.db.insert('messages', {
      ...args,
      role: 'assistant',
      userMetadata: {},
      sequence,
    })
  },

  async updateMessage(ctx: MutationCtx, args: { messageId: Id<'messages'>; message: Infer<typeof vUpdateMessage> }) {
    return await ctx.db.patch(args.messageId, args.message)
  },

  async deleteMessage(ctx: MutationCtx, args: { messageId: Id<'messages'> }) {
    return await ctx.db.delete(args.messageId)
  },

  async runCompletion(
    ctx: MutationCtx,
    args: { threadId: Id<'threads'>; run: { modelId?: string; instructions?: string } },
  ) {
    const thread = await chatHelpers.requireThread(ctx, args.threadId)

    const modelId = args.run.modelId ?? thread.run?.modelId
    const instructions = args.run.instructions ?? thread.run?.instructions

    if (!modelId) return null

    const messages = await ctx.db
      .query('messages')
      .withIndex('by_thread', (q) => q.eq('threadId', args.threadId))
      .order('desc')
      .filter((q) => q.neq(q.field('text'), undefined))
      .take(20)

    const outputMessageId = await chatHelpers.createCompletionMessage(ctx, { threadId: args.threadId })

    await ctx.scheduler.runAfter(0, internal.services.completion.completion, {
      input: { messages: messages.reverse(), modelId, system: instructions },
      output: { messageId: outputMessageId },
    })

    if (!thread.run || thread.run.modelId !== modelId || thread.run.instructions !== instructions) {
      await ctx.db.patch(args.threadId, { run: { modelId, instructions } })
    }
  },
}

// * create
export const createThread = mutation({
  args: {
    ...vThreadsTableSchema,
    messages: v.optional(v.array(vCreateChatMessage)),
  },
  handler: async (ctx, { messages = [], ...args }) => {
    const threadId = await chatHelpers.createThread(ctx, args)
    for (const message of messages) {
      await chatHelpers.createMessage(ctx, { ...message, threadId })
    }

    if (args.run) {
      await chatHelpers.runCompletion(ctx, { threadId, run: args.run })
    }
    return threadId
  },
})

export const deleteThread = mutation({
  args: {
    threadId: v.id('threads'),
  },
  handler: async (ctx, args) => {
    return await chatHelpers.deleteThread(ctx, args)
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

    const messageId = await chatHelpers.createMessage(ctx, { ...args.message, threadId: args.threadId })

    if (args.run) {
      await chatHelpers.runCompletion(ctx, { threadId: args.threadId, run: args.run })
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
    return await chatHelpers.updateMessage(ctx, args)
  },
})

export const deleteMessage = mutation({
  args: {
    messageId: v.id('messages'),
  },
  handler: async (ctx, args) => {
    return await chatHelpers.deleteMessage(ctx, args)
  },
})

export const runThread = mutation({
  args: {
    threadId: v.id('threads'),
    run: v.object(vRunsConfig),
  },
  handler: async (ctx, args) => {
    return await chatHelpers.runCompletion(ctx, args)
  },
})

// * list
export const listThreads = query({
  args: v.object({}),
  handler: async (ctx) => {
    const threads = await ctx.db.query('threads').take(100)

    return await asyncMap(threads, async (thread) => {
      if (thread.title) return thread
      const firstMessage = await chatHelpers.getFirstMessage(ctx, thread._id)
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
    const thread = await chatHelpers.getThread(ctx, args.threadId)
    if (!thread || thread.title) return thread
    const firstMessage = await chatHelpers.getFirstMessage(ctx, args.threadId)
    return {
      ...thread,
      title: firstMessage?.text?.slice(0, 100),
    }
  },
})
