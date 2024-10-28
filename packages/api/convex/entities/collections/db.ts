import { ConvexError } from 'convex/values'
import type { MutationCtx, QueryCtx } from '../../types'
import { nullifyDeletedEnt, nullifyDeletedEntWriter } from '../helpers'

export async function getCollection(ctx: QueryCtx, { collectionId }: { collectionId: string }) {
  const docId = ctx.table('collections').normalizeId(collectionId)
  const collection = docId
    ? await ctx.table('collections').get(docId)
    : await ctx.table('collections').get('xid', collectionId)
  return nullifyDeletedEnt(collection)
}

export async function getCollectionX(ctx: QueryCtx, { collectionId }: { collectionId: string }) {
  const collection = await getCollection(ctx, { collectionId })
  if (!collection) throw new ConvexError({ message: `Invalid collection id`, id: collectionId })
  return collection
}

export async function getCollectionWriter(ctx: MutationCtx, { collectionId }: { collectionId: string }) {
  const docId = ctx.table('collections').normalizeId(collectionId)
  const collection = docId
    ? await ctx.table('collections').get(docId)
    : await ctx.table('collections').get('xid', collectionId)
  return nullifyDeletedEntWriter(collection)
}

export async function getCollectionWriterX(ctx: MutationCtx, { collectionId }: { collectionId: string }) {
  const collection = await getCollectionWriter(ctx, { collectionId })
  if (!collection) throw new ConvexError({ message: `Invalid collection id`, id: collectionId })
  return collection
}
