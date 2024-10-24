import { asyncMap } from 'convex-helpers'
import { paginationOptsValidator } from 'convex/server'
import { nanoid } from 'nanoid/non-secure'
import { internal } from '../_generated/api'
import { generationSchemaFields } from '../entities/generations'
import { internalMutation, mutation, query } from '../functions'
import { emptyPage, paginatedReturnFields } from '../lib/utils'
import type { Ent, QueryCtx, TextToImageInputs } from '../types'
import { nullable, omit, pick, v } from '../values'
import { generateXID, getEntity, getEntityWriterX } from './helpers/xid'
import { getImageV2Edges, imagesReturn } from './images'

export const textToImageInputs = v.object({
  type: v.literal('textToImage'),
  modelId: v.string(),
  workflow: v.optional(v.string()),

  prompt: v.string(),
  negativePrompt: v.optional(v.string()),
  n: v.optional(v.number()),
  width: v.optional(v.number()),
  height: v.optional(v.number()),
  size: v.optional(v.string()),
  seed: v.optional(v.number()),
  guidanceScale: v.optional(v.number()),
  steps: v.optional(v.number()),

  loras: v.optional(
    v.array(
      v.object({
        path: v.string(),
        scale: v.optional(v.number()),
      }),
    ),
  ),
})

export const generationsReturn = v.object({
  _id: v.id('generations_v2'),
  _creationTime: v.number(),
  ...omit(generationSchemaFields, ['output']),
  kvMetadata: v.optional(v.record(v.string(), v.string())),
  images: v.array(imagesReturn),
  xid: v.string(),
})

export const getGenerationEdges = async (ctx: QueryCtx, generation: Ent<'generations_v2'>) => {
  const doc = omit(generation.doc(), ['output'])
  return {
    ...doc,
    input: generation.input as TextToImageInputs,
    images: await ctx
      .table('images_v2', 'generationId', (q) => q.eq('generationId', generation._id))
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .map(async (image) => getImageV2Edges(ctx, image)),
  }
}

export const get = query({
  args: {
    generationId: v.id('generations_v2'),
  },
  handler: async (ctx, { generationId }) => {
    const generation = await getEntity(ctx, 'generations_v2', generationId)
    return generation ? await getGenerationEdges(ctx, generation) : null
  },
  returns: nullable(generationsReturn),
})

export const list = query({
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
  returns: v.object({ ...paginatedReturnFields, page: v.array(generationsReturn) }),
})

// * mutations
export const create = mutation({
  args: {
    inputs: v.array(textToImageInputs),
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

export const activate = internalMutation({
  args: {
    generationId: v.id('generations_v2'),
  },
  handler: async (ctx, { generationId }) => {
    const generation = await ctx.skipRules.table('generations_v2').getX(generationId)
    if (generation.status !== 'queued') {
      throw new Error('Generation is not queued')
    }

    await generation.patch({
      status: 'active',
      updatedAt: Date.now(),
    })

    return generation
  },
})

export const complete = internalMutation({
  args: {
    generationId: v.id('generations_v2'),
    results: v.array(generationSchemaFields.results.element),
    output: v.any(),
  },
  handler: async (ctx, { generationId, results, output }) => {
    const generation = await ctx.skipRules.table('generations_v2').getX(generationId)
    if (generation.status !== 'active') {
      throw new Error('Image generation is not active')
    }

    await generation.patch({
      status: 'done',
      updatedAt: Date.now(),
      results,
      output,
    })

    for (const result of results) {
      await ctx.scheduler.runAfter(0, internal.action.ingestImageUrl.run, {
        sourceType: 'generation',
        sourceUrl: result.url,
        generationId,
        ownerId: generation.ownerId,
        runId: generation.runId,
      })
    }
  },
})

export const fail = internalMutation({
  args: {
    generationId: v.id('generations_v2'),
    ...pick(generationSchemaFields, ['errors']),
  },
  handler: async (ctx, { generationId, errors }) => {
    const generation = await ctx.skipRules.table('generations_v2').getX(generationId)
    if (generation.status !== 'active') {
      throw new Error('Image generation is not active')
    }

    await generation.patch({
      status: 'failed',
      updatedAt: Date.now(),
      errors,
    })
  },
})

export const destroy = mutation({
  args: {
    id: v.string(),
    destroyImages: v.boolean(),
  },
  handler: async (ctx, { id, destroyImages }) => {
    const generation = await getEntityWriterX(ctx, 'generations_v2', id)
    await generation.delete()

    if (destroyImages) {
      await ctx
        .table('images_v2', 'generationId', (q) => q.eq('generationId', generation._id))
        .map((image) => image.delete())
    }
  },
  returns: v.null(),
})
