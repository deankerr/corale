import { ConvexError } from 'convex/values'
import type { MutationCtx, QueryCtx } from '../../types'
import { nullifyDeletedEnt, nullifyDeletedEntWriter } from '../helpers'

export async function getGeneration(ctx: QueryCtx, { generationId }: { generationId: string }) {
  const docId = ctx.table('generations_v2').normalizeId(generationId)
  const generation = docId
    ? await ctx.table('generations_v2').get(docId)
    : await ctx.table('generations_v2').get('xid', generationId)
  return nullifyDeletedEnt(generation)
}

export async function getGenerationX(ctx: QueryCtx, { generationId }: { generationId: string }) {
  const generation = await getGeneration(ctx, { generationId })
  if (!generation) throw new ConvexError({ message: `Invalid generation id`, id: generationId })
  return generation
}

export async function getGenerationWriter(ctx: MutationCtx, { generationId }: { generationId: string }) {
  const docId = ctx.table('generations_v2').normalizeId(generationId)
  const generation = docId
    ? await ctx.table('generations_v2').get(docId)
    : await ctx.table('generations_v2').get('xid', generationId)
  return nullifyDeletedEntWriter(generation)
}

export async function getGenerationWriterX(ctx: MutationCtx, { generationId }: { generationId: string }) {
  const generation = await getGenerationWriter(ctx, { generationId })
  if (!generation) throw new ConvexError({ message: `Invalid generation id`, id: generationId })
  return generation
}
