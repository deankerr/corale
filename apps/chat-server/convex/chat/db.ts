import { internal } from '#api'
import { mutation, query, v, type Id, type MutationCtx, type QueryCtx } from '#common'
import type { AsObjectValidator, Infer } from 'convex/values'
import { vCreateChatMessage, vThreadsTableSchema, vUpdateMessage } from './schemas'

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

  async getLatestMessage(ctx: QueryCtx, threadId: Id<'threads'>) {
    return await ctx.db
      .query('messages')
      .withIndex('by_thread', (q) => q.eq('threadId', threadId))
      .order('desc')
      .first()
  },

  async updateMessage(ctx: MutationCtx, args: { messageId: Id<'messages'>; message: Infer<typeof vUpdateMessage> }) {
    return await ctx.db.patch(args.messageId, args.message)
  },
}

// * create
export const createThread = mutation({
  args: {
    ...vThreadsTableSchema,
    messages: v.array(vCreateChatMessage),
  },
  handler: async (ctx, { messages, ...args }) => {
    const threadId = await chatHelpers.createThread(ctx, args)
    for (const message of messages) {
      await chatHelpers.createMessage(ctx, { ...message, threadId })
    }
    return threadId
  },
})

export const createMessage = mutation({
  args: {
    threadId: v.id('threads'),
    message: vCreateChatMessage,
    modelId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    console.log('createMessage', args)

    const messageId = await chatHelpers.createMessage(ctx, { ...args.message, threadId: args.threadId })

    if (args.modelId) {
      const messages = await ctx.db
        .query('messages')
        .withIndex('by_thread', (q) => q.eq('threadId', args.threadId))
        .order('desc')
        .filter((q) => q.neq(q.field('text'), undefined))
        .take(20)

      const outputMessageId = await chatHelpers.createCompletionMessage(ctx, { threadId: args.threadId })

      await ctx.scheduler.runAfter(0, internal.services.completion.completion, {
        input: { messages, modelId: args.modelId },
        output: { messageId: outputMessageId },
      })
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

// * list
export const listThreads = query({
  args: v.object({}),
  handler: async (ctx) => {
    return await ctx.db.query('threads').take(100)
  },
})

export const listMessages = query({
  args: v.object({
    threadId: v.id('threads'),
  }),
  handler: async (ctx, args) => {
    return await ctx.db
      .query('messages')
      .withIndex('by_thread', (q) => q.eq('threadId', args.threadId))
      .take(100)
  },
})

// * get
export const getThread = query({
  args: v.object({
    threadId: v.id('threads'),
  }),
  handler: async (ctx, args) => {
    return await chatHelpers.getThread(ctx, args.threadId)
  },
})
