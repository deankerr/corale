import { ConvexError } from 'convex/values'
import type { MutationCtx, QueryCtx } from '../../../types'
import { nullifyDeletedEnt, nullifyDeletedEntWriter } from '../../helpers'

export async function getRun(ctx: QueryCtx, { runId }: { runId: string }) {
  const docId = ctx.table('runs').normalizeId(runId)
  const run = docId ? await ctx.table('runs').get(docId) : await ctx.table('runs').get('xid', runId)
  return nullifyDeletedEnt(run)
}

export async function getRunX(ctx: QueryCtx, { runId }: { runId: string }) {
  const run = await getRun(ctx, { runId })
  if (!run || run.deletionTime) throw new ConvexError({ message: `Invalid run id`, id: runId })
  return run
}

export async function getRunWriter(ctx: MutationCtx, { runId }: { runId: string }) {
  const docId = ctx.table('runs').normalizeId(runId)
  const run = docId ? await ctx.table('runs').get(docId) : await ctx.table('runs').get('xid', runId)
  return nullifyDeletedEntWriter(run)
}

export async function getRunWriterX(ctx: MutationCtx, { runId }: { runId: string }) {
  const run = await getRunWriter(ctx, { runId })
  if (!run || run.deletionTime) throw new ConvexError({ message: `Invalid run id`, id: runId })
  return run
}
