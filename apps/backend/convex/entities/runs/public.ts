import { paginationOptsValidator } from 'convex/server'
import { internal } from '../../_generated/api'
import type { Id } from '../../_generated/dataModel'
import { getUser } from '../../entities/users/db'
import { mutation, query } from '../../functions'
import { ConvexError, nullable, v } from '../../values'
import { generateXID } from '../helpers'
import { updateKvMetadata } from '../kvMetadata'
import { createMessage } from '../messages/db'
import { getPattern, getPatternWriter } from '../patterns/db'
import { getThread, getThreadWriter } from '../threads/db'
import { getRun } from './db'
import { RunCreate, RunReturn } from './validators'

// * queries
export const get = query({
  args: {
    runId: v.string(),
  },
  handler: async (ctx, { runId }) => {
    return getRun(ctx, { runId })
  },
  returns: nullable(RunReturn),
})

export const getTextStreams = query({
  args: {
    runId: v.id('runs'),
  },
  handler: async (ctx, { runId }): Promise<{ content: string; _id: Id<'texts'> }[]> => {
    const run = await getRun(ctx, { runId })
    if (!run) return []

    const texts = await ctx
      .table('texts', 'runId', (q) => q.eq('runId', run._id))
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .map((text) => ({ content: text.content, _id: text._id }))
    return texts
  },
  returns: v.array(v.object({ content: v.string(), _id: v.id('texts') })),
})

export const adminListAll = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const user = await ctx.viewerX()
    if (user.role !== 'admin') throw new ConvexError('Unauthorized')

    return await ctx
      .table('runs')
      .order('desc')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .paginate(args.paginationOpts)
      .map(async (run) => {
        const { userId, threadId, patternId } = run
        const user = await getUser(ctx, userId)
        const thread = await getThread(ctx, { threadId })

        return {
          ...run,
          pattern: patternId ? await getPattern(ctx, { patternId }) : undefined,
          instructions: run.instructions?.slice(0, 20),
          username: user?.name ?? 'Unknown',
          threadTitle: thread?.title ?? 'Unknown',
        }
      })
  },
})

// * mutations
export const create = mutation({
  args: RunCreate,
  handler: async (ctx, args) => {
    const thread = await getThreadWriter(ctx, { threadId: args.threadId })
    if (!thread) throw new ConvexError('invalid thread id')

    const pattern = args.patternId ? await getPatternWriter(ctx, { patternId: args.patternId }) : null
    if (pattern) {
      await pattern.patch({ lastUsedAt: Date.now() })
    }

    const model = args.model ?? pattern?.model
    if (!model) {
      throw new ConvexError('no model provided')
      // ? use fallback model
    }

    // * tag thread with ids to inform frontend input settings
    const threadKvMetadata = updateKvMetadata(thread.kvMetadata, {
      set: {
        'esuite:model:id': model.id,
        'esuite:pattern:xid': pattern?.xid,
      },
    })
    await thread.patch({ updatedAtTime: Date.now(), kvMetadata: threadKvMetadata })

    for (const message of args.appendMessages ?? []) {
      await createMessage(ctx, {
        threadId: thread._id,
        userId: thread.userId,
        ...message,
      })
    }

    const xid = generateXID()
    const runId = await ctx.table('runs').insert({
      status: 'queued',
      stream: args.stream,
      patternId: pattern?._id,
      model,
      options: args.options ?? pattern?.options,
      instructions: args.instructions ?? pattern?.instructions,
      additionalInstructions: args.additionalInstructions,
      dynamicMessage: args.dynamicMessage ?? pattern?.dynamicMessage,
      kvMetadata: args.kvMetadata ?? {},

      timings: {
        queuedAt: Date.now(),
      },

      threadId: thread._id,
      userId: thread.userId,

      updatedAt: Date.now(),
      xid,
    })

    await ctx.scheduler.runAfter(0, internal.action.run.run, {
      runId,
    })

    return xid
  },
  returns: v.string(),
})
