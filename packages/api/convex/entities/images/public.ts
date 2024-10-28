import { mutation, query } from '../../functions'
import { emptyPage, paginatedReturnFields } from '../../lib/utils'
import { literals, paginationOptsValidator, v, type Infer } from '../../values'
import { getImageEdges, getImageWriterX } from './db'
import { ImageReturn } from './validators'

export const getByRunId = query({
  args: {
    runId: v.string(),
  },
  handler: async (ctx, { runId }) => {
    return await ctx
      .table('images_v2', 'runId', (q) => q.eq('runId', runId))
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .map(async (image) => await getImageEdges(ctx, image))
  },
  returns: v.array(ImageReturn),
})

export const listMy = query({
  args: {
    paginationOpts: paginationOptsValidator,
    order: v.optional(literals('asc', 'desc')),
  },
  handler: async (ctx, { paginationOpts, order = 'desc' }) => {
    const viewerId = ctx.viewerId
    if (!viewerId) return emptyPage()

    return await ctx
      .table('images_v2', 'ownerId', (q) => q.eq('ownerId', viewerId))
      .order(order)
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .paginate(paginationOpts)
      .map((image) => getImageEdges(ctx, image))
  },
  returns: v.object({ ...paginatedReturnFields, page: v.array(ImageReturn) }),
})

export const remove = mutation({
  args: {
    imageId: v.string(),
  },
  handler: async (ctx, { imageId }) => {
    const image = await getImageWriterX(ctx, { imageId })
    return await image.delete()
  },
})
