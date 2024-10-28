import type { PaginationOptions } from 'convex/server'
import { query } from '../../functions'
import { emptyPage, paginatedReturnFields } from '../../lib/utils'
import type { QueryCtx } from '../../types'
import { nullable, paginationOptsValidator, v } from '../../values'
import { getAudio } from './db'
import { AudioReturn } from './validators'

// * queries
export const get = query({
  args: {
    audioId: v.string(),
  },
  handler: async (ctx, args) => {
    const audio = await getAudio(ctx, args)
    return audio ? { ...audio, fileUrl: await ctx.storage.getUrl(audio.fileId) } : null
  },
  returns: nullable(AudioReturn),
})

export const listMy = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx: QueryCtx, args: { paginationOpts: PaginationOptions }) => {
    const userId = ctx.viewerId
    if (!userId) return emptyPage()

    const list = await ctx
      .table('audio', 'userId', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .order('desc')
      .paginate(args.paginationOpts)
      .map(async (audio) => ({ ...audio, fileUrl: await ctx.storage.getUrl(audio.fileId) }))

    return list
  },
  returns: v.object({ ...paginatedReturnFields, page: v.array(AudioReturn) }),
})
