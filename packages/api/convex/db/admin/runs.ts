import { paginationOptsValidator } from 'convex/server'
import { query } from '../../functions'
import { createError } from '../../lib/utils'
import { getEntity } from '../helpers/xid'
import { getUserPublic } from '../users'

export const list = query({
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
        const user = await getUserPublic(ctx, run.userId)
        const thread = await getEntity(ctx, 'threads', run.threadId)

        return {
          ...run,
          pattern: run.patternId ? await getEntity(ctx, 'patterns', run.patternId) : undefined,
          instructions: run.instructions?.slice(0, 20),
          username: user?.name ?? 'Unknown',
          threadTitle: thread?.title ?? 'Unknown',
        }
      })
  },
})
