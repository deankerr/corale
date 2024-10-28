import { ConvexError, type Infer } from 'convex/values'
import type { Ent, MutationCtx, QueryCtx } from '../../types'
import { omit } from '../../values'
import { nullifyDeletedEnt, nullifyDeletedEntWriter } from '../helpers'
import { getImageEdges } from '../images/db'
import type { TextToImageInputs } from '../shared'

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

export const getGenerationEdges = async (ctx: QueryCtx, generation: Ent<'generations_v2'>) => {
  const doc = omit(generation.doc(), ['output'])
  return {
    ...doc,
    input: generation.input as Infer<typeof TextToImageInputs>,
    images: await ctx
      .table('images_v2', 'generationId', (q) => q.eq('generationId', generation._id))
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .map(async (image) => getImageEdges(ctx, image)),
  }
}
