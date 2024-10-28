import { ConvexError, v } from 'convex/values'
import { query } from '../../functions'

export const latest = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit = 10 }) => {
    const viewer = await ctx.viewerX()
    if (viewer.role !== 'admin') {
      throw new ConvexError('Unauthorized')
    }

    return await ctx.table('operationsEventLog').order('desc').take(limit)
  },
})
