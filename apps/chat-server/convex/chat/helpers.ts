import { internal } from '#api'
import { asyncMap, type Id, type MutationCtx, type QueryCtx } from '#common'
import type { AsObjectValidator, Infer } from 'convex/values'
import { vCreateChatMessage, vThreadsTableSchema, vUpdateMessage, type vMessagesTableSchema } from './schemas'

const threads = {
  async get(ctx: QueryCtx, threadId: Id<'threads'>) {
    return await ctx.db.get(threadId)
  },

  async require(ctx: QueryCtx, threadId: Id<'threads'>) {
    const thread = await ctx.db.get(threadId)
    if (!thread) throw new Error('Thread not found')
    return thread
  },

  async create(ctx: MutationCtx, args: Infer<AsObjectValidator<typeof vThreadsTableSchema>>) {
    return await ctx.db.insert('threads', args)
  },

  async update(
    ctx: MutationCtx,
    args: { threadId: Id<'threads'>; thread: Infer<AsObjectValidator<typeof vThreadsTableSchema>> },
  ) {
    return await ctx.db.patch(args.threadId, args.thread)
  },

  async delete(ctx: MutationCtx, args: { threadId: Id<'threads'> }) {
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
    const prevMessage = await threads.getLatestMessage(ctx, args.threadId)
    const sequence = prevMessage ? prevMessage.sequence + 1 : 0

    return await ctx.db.insert('messages', {
      ...args,
      data: args.data ?? {},
      userMetadata: args.userMetadata ?? {},
      sequence,
    })
  },

  async createCompletionMessage(
    ctx: MutationCtx,
    args: Omit<Infer<AsObjectValidator<typeof vMessagesTableSchema>>, 'role' | 'sequence'>,
  ) {
    const prevMessage = await threads.getLatestMessage(ctx, args.threadId)
    const sequence = prevMessage ? prevMessage.sequence + 1 : 0

    return await ctx.db.insert('messages', {
      ...args,
      role: 'assistant',
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
    const thread = await threads.require(ctx, args.threadId)

    const modelId = args.run.modelId ?? thread.run?.modelId
    const instructions = args.run.instructions ?? thread.run?.instructions

    if (!modelId) return null

    const messages = await ctx.db
      .query('messages')
      .withIndex('by_thread', (q) => q.eq('threadId', args.threadId))
      .order('desc')
      .filter((q) => q.neq(q.field('text'), undefined))
      .take(20)

    const outputMessageId = await threads.createCompletionMessage(ctx, {
      threadId: args.threadId,
      data: {
        modelId,
      },
      userMetadata: {},
    })

    await ctx.scheduler.runAfter(0, internal.services.completion.completion, {
      input: { messages: messages.reverse(), modelId, system: instructions },
      output: { messageId: outputMessageId },
    })

    if (!thread.run || thread.run.modelId !== modelId || thread.run.instructions !== instructions) {
      await ctx.db.patch(args.threadId, { run: { modelId, instructions } })
    }
  },
}

export const chat = { threads }
