import { asyncMap } from 'convex-helpers'
import { paginationOptsValidator } from 'convex/server'
import { nanoid } from 'nanoid/non-secure'
import { internal } from '../../_generated/api'
import { GenerationReturn } from '../../entities/generations/validators'
import { TextToImageInputs } from '../../entities/shared'
import { mutation, query } from '../../functions'
import { emptyPage, paginatedReturnFields } from '../../lib/utils'
import { nullable, v } from '../../values'
import { generateXID } from '../helpers'
import { getGeneration, getGenerationEdges, getGenerationWriterX } from './db'

export const get = query({
  args: {
    generationId: v.string(),
  },
  handler: async (ctx, { generationId }) => {
    const generation = await getGeneration(ctx, { generationId })
    return generation ? await getGenerationEdges(ctx, generation) : null
  },
  returns: nullable(GenerationReturn),
})

export const listMy = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    const userId = ctx.viewerId
    if (!userId) return emptyPage()

    return await ctx
      .table('generations_v2', 'ownerId', (q) => q.eq('ownerId', userId))
      .order('desc')
      .paginate(paginationOpts)
      .map(async (gen) => await getGenerationEdges(ctx, gen))
  },
  returns: v.object({ ...paginatedReturnFields, page: v.array(GenerationReturn) }),
})

// * mutations
export const create = mutation({
  args: {
    inputs: v.array(TextToImageInputs),
  },
  handler: async (ctx, { inputs }) => {
    const viewer = await ctx.viewerX()
    const runId = nanoid()

    const ids = await asyncMap(inputs, async (input) => {
      const xid = generateXID()
      const id = await ctx.table('generations_v2').insert({
        status: 'queued',
        updatedAt: Date.now(),
        input: { ...input, negativePrompt: input.negativePrompt || undefined, configId: nanoid() },
        runId,
        ownerId: viewer._id,
        xid,
      })

      await ctx.scheduler.runAfter(0, internal.action.textToImage.run, {
        generationId: id,
      })

      return xid
    })

    return {
      runId,
      generationIds: ids,
    }
  },
  returns: v.object({
    runId: v.string(),
    generationIds: v.array(v.string()),
  }),
})

export const remove = mutation({
  args: {
    generationId: v.string(),
    destroyImages: v.boolean(),
  },
  handler: async (ctx, { generationId, destroyImages }) => {
    const generation = await getGenerationWriterX(ctx, { generationId })
    await generation.delete()

    if (destroyImages) {
      await ctx
        .table('images_v2', 'generationId', (q) => q.eq('generationId', generation._id))
        .map((image) => image.delete())
    }
  },
  returns: v.null(),
})
