import { asyncMap, mutation, query, v } from '#common'
import { chat } from './helpers'
import { vCreateChatMessage, vRunsConfig, vUpdateMessage, vUpdateThread } from './schemas'

// * create
export const createThread = mutation({
  args: {
    ...vUpdateThread.fields,
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

export const updateThread = mutation({
  args: {
    threadId: v.id('threads'),
    thread: vUpdateThread,
  },
  handler: async (ctx, args) => {
    return await chat.threads.update(ctx, args)
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
    branch: v.optional(v.string()),
    run: v.optional(v.object(vRunsConfig)),
  },
  handler: async (ctx, args) => {
    console.log('createMessage', args)

    const messageId = await chat.threads.createMessage(ctx, {
      ...args.message,
      threadId: args.threadId,
      branch: args.branch,
    })

    if (args.run) {
      await chat.threads.runCompletion(ctx, { threadId: args.threadId, run: args.run, afterMessageId: messageId })
    }

    return messageId
  },
})

// * appendMessage
// required: threadId
// (no args): append to end of initial branch
// branch: append to end of branch
// messageId (and/or branch+sequence ?):
//   - if message is end of branch, append to branch as before
//   - otherwise create a new branch
export const appendMessage = mutation({
  args: {
    threadId: v.id('threads'),
    message: vCreateChatMessage,
    branch: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    console.debug('appendMessage', args)

    // ? awkward args syntax
    return await chat.threads.createMessage(ctx, { ...args.message, threadId: args.threadId, branch: args.branch })
  },
})

export const showMessagesFrom = mutation({
  args: {
    messageId: v.id('messages'),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId)
    if (!message) return null

    const messages = await chat.getMessagesFrom(ctx, { message, limit: 20 })

    console.log('result:', messages)
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
    branch: v.optional(v.string()),
    atMessageId: v.optional(v.id('messages')),
  },
  handler: async (ctx, args) => {
    const atMessageId = args.atMessageId ?? (await chat.threads.getLatestMessage(ctx, args.threadId, args.branch))?._id
    return await chat.threads.runCompletion(ctx, { ...args, afterMessageId: atMessageId })
  },
})

// ? get all messages of a sequence, then deal with branches
export const regenerate = mutation({
  args: {
    messageId: v.id('messages'),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId)
    if (!message) throw new Error('invalid message id')

    // todo branch traversal
    const prevMessage = await ctx.db
      .query('messages')
      .withIndex('by_thread_branch_sequence', (q) =>
        q
          .eq('threadId', message.threadId)
          .eq('branch', message.branch)
          .eq('sequence', message.sequence - 1),
      )
      .first()

    if (!prevMessage) throw new Error('no prev message')

    const thread = await chat.threads.require(ctx, message.threadId)
    const modelId = message.data.modelId ?? thread.run?.modelId
    if (!modelId) throw new Error('no model id')
    return await chat.threads.runCompletion(ctx, {
      threadId: thread._id,
      run: { modelId, instructions: thread.run?.instructions },
      afterMessageId: prevMessage._id,
    })
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
