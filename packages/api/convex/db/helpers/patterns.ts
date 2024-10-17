import { ConvexError } from 'convex/values'
import type { MutationCtx, QueryCtx } from '../../types'

export async function getPattern(ctx: QueryCtx, id: string) {
  const _id = ctx.table('patterns').normalizeId(id)
  const pattern = _id ? await ctx.table('patterns').get(_id) : await ctx.table('patterns').get('xid', id)
  return pattern && !pattern.deletionTime ? pattern : null
}

export async function getPatternX(ctx: QueryCtx, id: string) {
  const pattern = await getPattern(ctx, id)
  if (!pattern) throw new ConvexError({ message: 'invalid pattern id', id: id })
  return pattern
}

export async function getPatternWriter(ctx: MutationCtx, id: string) {
  const _id = ctx.table('patterns').normalizeId(id)
  const pattern = _id ? await ctx.table('patterns').get(_id) : await ctx.table('patterns').get('xid', id)
  return pattern && !pattern.deletionTime ? pattern : null
}

export async function getPatternWriterX(ctx: MutationCtx, id: string) {
  const pattern = await getPatternWriter(ctx, id)
  if (!pattern) throw new ConvexError({ message: 'invalid pattern id', id: id })
  return pattern
}
