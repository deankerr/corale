import { asyncMap } from 'convex-helpers'
import { paginationOptsValidator } from 'convex/server'
import { nanoid } from 'nanoid/non-secure'
import { internal } from '../../_generated/api'
import { internalMutation, mutation, query } from '../../functions'
import { emptyPage, paginatedReturnFields } from '../../lib/utils'
import { nullable, pick, v } from '../../values'
import { TextToImageInputs } from '../shared'
import { getGenerationWriterX } from './db'
import { GenerationReturn, GenerationSchemaFields } from './validators'

export const activate = internalMutation({
  args: {
    generationId: v.id('generations_v2'),
  },
  handler: async (ctx, { generationId }) => {
    const generation = await getGenerationWriterX(ctx, { generationId })
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
    results: v.array(GenerationSchemaFields.results.element),
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
    ...pick(GenerationSchemaFields, ['errors']),
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
