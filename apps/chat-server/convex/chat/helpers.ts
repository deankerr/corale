import { internal } from '#api'
import { asyncMap, type Doc, type Id, type MutationCtx, type QueryCtx } from '#common'
import type { AsObjectValidator, Infer } from 'convex/values'
import { vCreateChatMessage, vUpdateMessage, type vMessagesTableSchema, type vUpdateThread } from './schemas'

const INITIAL_BRANCH = 'a'

const threads = {
  async get(ctx: QueryCtx, threadId: Id<'threads'>) {
    return await ctx.db.get(threadId)
  },

  async require(ctx: QueryCtx, threadId: Id<'threads'>) {
    const thread = await ctx.db.get(threadId)
    if (!thread) throw new Error('Thread not found')
    return thread
  },

  async create(ctx: MutationCtx, args: Infer<typeof vUpdateThread>) {
    return await ctx.db.insert('threads', { ...args, branches: [INITIAL_BRANCH] })
  },

  async update(
    ctx: MutationCtx,
    args: {
      threadId: Id<'threads'>
      thread: Infer<typeof vUpdateThread>
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
      .withIndex('by_thread_branch_sequence', (q) => q.eq('threadId', threadId).eq('branch', branch))
      .order('desc')
      .first()
  },

  async getMessageAt(ctx: QueryCtx, args: { threadId: Id<'threads'>; branch: string; sequence: number }) {
    return await ctx.db
      .query('messages')
      .withIndex('by_thread_branch_sequence', (q) =>
        q.eq('threadId', args.threadId).eq('branch', args.branch).eq('sequence', args.sequence),
      )
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
    const fromMessage = args.afterMessageId
      ? await ctx.db.get(args.afterMessageId)
      : await threads.getLatestMessage(ctx, thread._id)
    if (!fromMessage) throw new Error('no message to complete from')

    const modelId = args.run.modelId ?? thread.run?.modelId
    const instructions = args.run.instructions ?? thread.run?.instructions

    if (!modelId) return null

    const messages = await getMessagesFrom(ctx, { message: fromMessage, limit: 20 })

    // completion message
    const nextPosition = await getNextPosition(ctx, fromMessage)
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

export const chat = { threads, getMessagesFrom }

async function getNextPosition(ctx: MutationCtx, message: Doc<'messages'>) {
  const nextMessageInBranch = await threads.getMessageAt(ctx, {
    threadId: message.threadId,
    branch: message.branch,
    sequence: message.sequence + 1,
  })

  if (!nextMessageInBranch) {
    // sequential message
    return {
      sequence: message.sequence + 1,
      branch: message.branch,
      branchSequence: message.branchSequence + 1,
    }
  }

  // * create new branch
  // find all existing branches from current
  const thread = await threads.require(ctx, message.threadId)
  console.log('create branch, current:', thread.branches)
  // '0', '0-a', '0-b', '0-a-a', '0-a-b', '0-b-a', '0-a-b-a'
  const siblingBranches = thread.branches
    .filter((b) => b.startsWith(message.branch) && b.length === message.branch.length + 2)
    .sort()
  console.log('siblingBranches', siblingBranches)
  // increment last branch or create first sub-branch
  const latestBranchSegment = siblingBranches.at(-1)?.at(-1)
  const nextBranch =
    latestBranchSegment === undefined ? `${message.branch}-a` : `${message.branch}-${inc36(latestBranchSegment)}`
  console.log('new branch', nextBranch)

  await ctx.db.patch(thread._id, { branches: [...thread.branches, nextBranch] })

  return {
    sequence: message.sequence + 1,
    branch: nextBranch,
    branchSequence: 0,
  }
}

function inc36(n: string) {
  const num = parseInt(n, 36)
  return (num + 1).toString(36)
}

function getBranchSegmentsToRoot(branch: string) {
  // '0', '0-a', '0-b', '0-a-a', '0-a-b', '0-b-a', '0-a-b-a'
  // eg: path to root from '0-a-b-a': 0-a-b-a, 0-a-b, 0-a, 0
  const branches: string[] = []
  let currentBranch = branch

  // Add the current branch first
  branches.push(currentBranch)

  // Keep removing the last segment until we reach the root branch '0'
  while (currentBranch !== INITIAL_BRANCH) {
    currentBranch = currentBranch.split('-').slice(0, -1).join('-')
    branches.push(currentBranch)
  }

  return branches
}

async function getMessagesFrom(ctx: QueryCtx, args: { message: Doc<'messages'>; limit: number }) {
  const branches = getBranchSegmentsToRoot(args.message.branch)
  let currentSeq = args.message.sequence

  console.log(branches, currentSeq)

  const messages: Doc<'messages'>[] = []

  for (const branch of branches) {
    if (currentSeq < 0 || messages.length >= args.limit) break
    console.log('get', branch, currentSeq)

    const msgs = await ctx.db
      .query('messages')
      .withIndex('by_thread_branch_sequence', (q) =>
        q.eq('threadId', args.message.threadId).eq('branch', branch).lte('sequence', currentSeq),
      )
      .take(args.limit - messages.length)

    currentSeq = (msgs[0].sequence ?? 0) - 1
    messages.push(...msgs.reverse())
  }

  console.log('got', messages.length, 'messages')
  return messages
}
