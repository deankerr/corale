import { ConvexError } from 'convex/values'
import type { Ent, MutationCtx, QueryCtx } from '../../types'
import { nullifyDeletedEnt, nullifyDeletedEntWriter } from '../helpers'
import { getImageEdges } from '../images/db'

export async function getCollection(ctx: QueryCtx, { collectionId }: { collectionId: string }) {
  const docId = ctx.table('collections').normalizeId(collectionId)
  const collection = docId
    ? await ctx.table('collections').get(docId)
    : await ctx.table('collections').get('xid', collectionId)
  return nullifyDeletedEnt(collection)
}

export async function getCollectionX(ctx: QueryCtx, { collectionId }: { collectionId: string }) {
  const collection = await getCollection(ctx, { collectionId })
  if (!collection || collection.deletionTime)
    throw new ConvexError({ message: `Invalid collection id`, id: collectionId })
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
  if (!collection || collection.deletionTime)
    throw new ConvexError({ message: `Invalid collection id`, id: collectionId })
  return collection
}

export const getCollectionEdges = async (ctx: QueryCtx, collection: Ent<'collections'>) => {
  const images = await collection
    .edge('images_v2')
    .order('desc')
    .take(24)
    .map(async (image) => getImageEdges(ctx, image))

  return {
    ...collection.doc(),
    images: images.filter((image) => image.deletionTime === undefined),
  }
}
