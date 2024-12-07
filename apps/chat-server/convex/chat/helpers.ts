import { internal } from '#api'
import { asyncMap, type Id, type MutationCtx, type QueryCtx } from '#common'
import type { AsObjectValidator, Infer } from 'convex/values'
import { vCreateChatMessage, vThreadsTableSchema, vUpdateMessage, type vMessagesTableSchema } from './schemas'

const INITIAL_BRANCH = '0'

const threads = {
  async get(ctx: QueryCtx, threadId: Id<'threads'>) {
    return await ctx.db.get(threadId)
  },

  async require(ctx: QueryCtx, threadId: Id<'threads'>) {
    const thread = await ctx.db.get(threadId)
    if (!thread) throw new Error('Thread not found')
    return thread
  },

  async create(ctx: MutationCtx, args: Omit<Infer<AsObjectValidator<typeof vThreadsTableSchema>>, 'latestBranch'>) {
    return await ctx.db.insert('threads', { ...args, latestBranch: INITIAL_BRANCH })
  },

  async update(
    ctx: MutationCtx,
    args: {
      threadId: Id<'threads'>
      thread: Omit<Infer<AsObjectValidator<typeof vThreadsTableSchema>>, 'latestBranch'>
    },
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

  async getLatestMessage(ctx: QueryCtx, threadId: Id<'threads'>, branch = INITIAL_BRANCH) {
    return await ctx.db
      .query('messages')
      .withIndex('by_thread_branch', (q) => q.eq('threadId', threadId).eq('branch', branch))
      .order('desc')
      .first()
  },

  async createMessage(ctx: MutationCtx, args: Infer<typeof vCreateChatMessage> & { threadId: Id<'threads'> }) {
    const prevMessage = await threads.getLatestMessage(ctx, args.threadId, args.branch)
    const sequence = prevMessage ? prevMessage.sequence + 1 : 0
    const branchSequence = prevMessage ? prevMessage.branchSequence + 1 : 0

    return await ctx.db.insert('messages', {
      ...args,
      branch: args.branch ?? INITIAL_BRANCH,
      data: args.data ?? {},
      userMetadata: args.userMetadata ?? {},
      sequence,
      branchSequence,
    })
  },

  async createCompletionMessage(
    ctx: MutationCtx,
    args: Omit<Infer<AsObjectValidator<typeof vMessagesTableSchema>>, 'role' | 'sequence' | 'branchSequence'>,
  ) {
    const prevMessage = await threads.getLatestMessage(ctx, args.threadId, args.branch)
    const sequence = prevMessage ? prevMessage.sequence + 1 : 0
    const branchSequence = prevMessage ? prevMessage.branchSequence + 1 : 0

    return await ctx.db.insert('messages', {
      ...args,
      role: 'assistant',
      sequence,
      branchSequence,
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
    args: {
      threadId: Id<'threads'>
      run: { modelId?: string; instructions?: string }
      afterMessageId?: Id<'messages'>
    },
  ) {
    const thread = await threads.require(ctx, args.threadId)

    const nextPosition = await getNextPosition(
      ctx,
      args.afterMessageId ? { messageId: args.afterMessageId } : { threadId: thread._id },
    )

    const modelId = args.run.modelId ?? thread.run?.modelId
    const instructions = args.run.instructions ?? thread.run?.instructions

    if (!modelId) return null

    // conversation messages
    const messages = await ctx.db
      .query('messages')
      .withIndex('by_thread_branch', (q) => q.eq('threadId', args.threadId).eq('branch', nextPosition.branches[0]))
      .order('desc')
      .filter((q) => q.neq(q.field('text'), undefined))
      .take(20)

    // completion message
    const outputMessageId = await ctx.db.insert('messages', {
      threadId: args.threadId,
      role: 'assistant',
      sequence: nextPosition.sequence,
      branch: nextPosition.branch,
      branchSequence: nextPosition.branchSequence,
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

async function getNextPosition(ctx: MutationCtx, args: { threadId: Id<'threads'> } | { messageId: Id<'messages'> }) {
  const message =
    'threadId' in args ? await threads.getLatestMessage(ctx, args.threadId) : await ctx.db.get(args.messageId)
  if (!message) throw new Error('Message not found')

  const latestMessage = await ctx.db
    .query('messages')
    .withIndex('by_thread_branch', (q) => q.eq('threadId', message.threadId).eq('branch', message.branch))
    .order('desc')
    .first()

  if (!latestMessage) throw new Error('Next message not found')

  if (message._id === latestMessage._id) {
    // is next message in current branch
    console.log('next position: current branch', message.branch)
    return {
      branches: [message.branch],
      sequence: message.sequence + 1,
      branch: message.branch,
      branchSequence: message.branchSequence + 1,
    }
  }

  // new branch
  const thread = await ctx.db.get(message.threadId)
  if (!thread) throw new Error('Thread not found')

  const latestBranch = parseInt(thread.latestBranch)
  const newBranch = latestBranch + 1

  await ctx.db.patch(message.threadId, { latestBranch: newBranch.toString() })
  console.log('next position: new branch', newBranch)

  return {
    branches: [message.branch],
    sequence: message.sequence + 1,
    branch: newBranch.toString(),
    branchSequence: 0,
  }
}
