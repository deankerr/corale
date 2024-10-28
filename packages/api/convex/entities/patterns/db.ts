import { ConvexError } from 'convex/values'
import type { MutationCtx, QueryCtx } from '../../types'
import { nullifyDeletedEnt, nullifyDeletedEntWriter } from '../helpers'

export async function getPattern(ctx: QueryCtx, { patternId }: { patternId: string }) {
  const docId = ctx.table('patterns').normalizeId(patternId)
  const pattern = docId ? await ctx.table('patterns').get(docId) : await ctx.table('patterns').get('xid', patternId)
  return nullifyDeletedEnt(pattern)
}

export async function getPatternX(ctx: QueryCtx, { patternId }: { patternId: string }) {
  const pattern = await getPattern(ctx, { patternId })
  if (!pattern) throw new ConvexError({ message: `Invalid pattern id`, id: patternId })
  return pattern
}

export async function getPatternWriter(ctx: MutationCtx, { patternId }: { patternId: string }) {
  const docId = ctx.table('patterns').normalizeId(patternId)
  const pattern = docId ? await ctx.table('patterns').get(docId) : await ctx.table('patterns').get('xid', patternId)
  return nullifyDeletedEntWriter(pattern)
}

export async function getPatternWriterX(ctx: MutationCtx, { patternId }: { patternId: string }) {
  const pattern = await getPatternWriter(ctx, { patternId })
  if (!pattern) throw new ConvexError({ message: `Invalid pattern id`, id: patternId })
  return pattern
}
