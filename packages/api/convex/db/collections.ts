import { mutation, query } from '../functions'
import { emptyPage, paginatedReturnFields } from '../lib/utils'
import type { Ent, QueryCtx } from '../types'
import { literals, nullable, paginationOptsValidator, v } from '../values'
import { updateKvMetadata, updateKvValidator } from './helpers/kvMetadata'
import { generateXID, getEntity, getEntityWriterX } from './helpers/xid'
import { getImageV2Edges, imagesReturn } from './images'

const collectionReturnFields = v.object({
  _id: v.id('collections'),
  _creationTime: v.number(),
  title: v.string(),
  ownerId: v.id('users'),
  kvMetadata: v.optional(v.record(v.string(), v.string())),
  // fields
  images: v.array(imagesReturn),
  xid: v.string(),
})

export const getCollectionEdges = async (ctx: QueryCtx, collection: Ent<'collections'>) => {
  const images = await collection
    .edge('images_v2')
    .order('desc')
    .take(24)
    .map(async (image) => getImageV2Edges(ctx, image))

  return {
    ...collection.doc(),
    images: images.filter((image) => image.deletionTime === undefined),
  }
}

export const get = query({
  args: {
    collectionId: v.string(),
  },
  handler: async (ctx, { collectionId }) => {
    const collection = await getEntity(ctx, 'collections', collectionId)
    return collection ? await getCollectionEdges(ctx, collection) : null
  },
  returns: nullable(collectionReturnFields),
})

export const latest = query({
  args: {},
  handler: async (ctx) => {
    const viewerId = ctx.viewerId
    if (!viewerId) return null

    return await ctx
      .table('collections', 'ownerId', (q) => q.eq('ownerId', viewerId))
      .order('desc')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .take(24)
      .map(async (collection) => await getCollectionEdges(ctx, collection))
  },
  returns: nullable(v.array(collectionReturnFields)),
})

export const listImages = query({
  args: {
    collectionId: v.string(),
    order: v.optional(literals('asc', 'desc')),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { collectionId, order = 'desc', paginationOpts }) => {
    const collection = await getEntity(ctx, 'collections', collectionId)
    if (!collection) return emptyPage()

    const result = await collection
      .edge('images_v2')
      .order(order)
      .paginate(paginationOpts)
      .map(async (image) => getImageV2Edges(ctx, image))

    return {
      ...result,
      page: result.page.filter((image) => image.deletionTime === undefined),
    }
  },
  returns: v.object({ ...paginatedReturnFields, page: v.array(imagesReturn) }),
})

export const create = mutation({
  args: {
    title: v.string(),
    kvMetadata: v.optional(v.record(v.string(), v.string())),
    imageIds: v.optional(v.array(v.id('images_v2'))),
  },
  handler: async (ctx, { title, kvMetadata, imageIds }) => {
    const viewer = await ctx.viewerX()

    const collectionId = await ctx.table('collections').insert({
      title,
      kvMetadata,
      ownerId: viewer._id,
      images_v2: imageIds,
      xid: generateXID(),
    })

    return collectionId
  },
})

export const update = mutation({
  args: {
    collectionId: v.string(),
    title: v.optional(v.string()),
    images_v2: v.optional(
      v.object({
        add: v.optional(v.array(v.id('images_v2'))),
        remove: v.optional(v.array(v.id('images_v2'))),
      }),
    ),
    updateKv: v.optional(updateKvValidator),
  },
  handler: async (ctx, { collectionId, updateKv, ...fields }) => {
    const collection = await getEntityWriterX(ctx, 'collections', collectionId)
    const kvMetadata = updateKvMetadata(collection.kvMetadata, updateKv)
    return await ctx
      .table('collections')
      .getX(collection._id)
      .patch({ ...fields, kvMetadata })
  },
})

export const remove = mutation({
  args: {
    collectionId: v.string(),
  },
  handler: async (ctx, { collectionId }) => {
    const collection = await getEntityWriterX(ctx, 'collections', collectionId)
    return await ctx.table('collections').getX(collection._id).delete()
  },
})
