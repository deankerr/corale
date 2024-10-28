import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'
import { getUser } from '../../entities/users/db'
import { query } from '../../functions'
import { createError } from '../../lib/utils'
import type { Id } from '../../types'
import { getPattern } from '../patterns/db'
import { getThread } from '../threads/db'

export const getTextStreams = query({
  args: {
    runId: v.id('runs'),
  },
  handler: async (ctx, { runId }): Promise<{ content: string; _id: Id<'texts'> }[]> => {
    const run = await ctx.table('runs').get(runId)
    if (!run) return []

    const texts = await ctx
      .table('texts', 'runId', (q) => q.eq('runId', run._id))
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .map((text) => ({ content: text.content, _id: text._id }))
    return texts
  },
  returns: v.array(v.object({ content: v.string(), _id: v.id('texts') })),
})

export const adminList = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const user = await ctx.viewerX()
    if (user.role !== 'admin') throw createError('Unauthorized', { code: 'unauthorized' })

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
