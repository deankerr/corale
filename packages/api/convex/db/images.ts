import { omit } from 'convex-helpers'
import { literals } from 'convex-helpers/validators'
import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'
import { getQuery, parseFilename } from 'ufo'
import { internal } from '../_generated/api'
import type { Id } from '../_generated/dataModel'
import { httpAction } from '../_generated/server'
import { internalMutation, internalQuery, mutation, query } from '../functions'
import { emptyPage, generateTimestampId, paginatedReturnFields } from '../lib/utils'
import { imagesV2Fields } from '../schema'
import type { Ent, QueryCtx } from '../types'
import { generateXID } from './helpers/xid'

export const imagesReturn = v.object({
  _id: v.id('images_v2'),
  _creationTime: v.number(),
  sourceUrl: v.string(),
  sourceType: v.string(),
  id: v.string(),
  fileId: v.string(),
  format: v.string(),
  width: v.number(),
  height: v.number(),
  blurDataUrl: v.string(),
  createdAt: v.optional(v.number()),
  color: v.string(),

  generationId: v.optional(v.id('generations_v2')),
  runId: v.string(),
  ownerId: v.id('users'),
  collectionIds: v.array(v.id('collections')),
  xid: v.optional(v.string()),
})

export const getImageV2Ent = async (ctx: QueryCtx, imageId: string) => {
  const _id = ctx.table('images_v2').normalizeId(imageId)
  return _id ? await ctx.table('images_v2').get(_id) : await ctx.table('images_v2').get('id', imageId)
}

export const getImageV2Edges = async (ctx: QueryCtx, image: Ent<'images_v2'>) => {
  return {
    ...image.doc(),
    collectionIds: await image.edge('collections').map((c) => c._id),
  }
}

export const getImageV2ByOwnerIdSourceUrl = async (ctx: QueryCtx, ownerId: Id<'users'>, sourceUrl: string) => {
  const image = await ctx
    .table('images_v2', 'ownerId_sourceUrl', (q) => q.eq('ownerId', ownerId).eq('sourceUrl', sourceUrl))
    .filter((q) => q.eq(q.field('deletionTime'), undefined))
    .first()
  return image ? await getImageV2Edges(ctx, image) : null
}

export const getDoc = internalQuery({
  args: {
    imageId: v.string(),
  },
  handler: async (ctx, args) => {
    return await getImageV2Ent(ctx, args.imageId)
  },
})

export const getByRunId = query({
  args: {
    runId: v.string(),
  },
  handler: async (ctx, { runId }) => {
    return await ctx
      .table('images_v2', 'runId', (q) => q.eq('runId', runId))
      .map(async (image) => await getImageV2Edges(ctx, image))
  },
  returns: v.array(imagesReturn),
})

export const createImageV2 = internalMutation({
  args: {
    ...omit(imagesV2Fields, ['createdAt']),
    createdAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const createdAt = args.createdAt ?? Date.now()

    let id
    while (!id || (await ctx.skipRules.table('images_v2').get('id', id))) {
      id = generateTimestampId(createdAt)
    }

    await ctx.skipRules.table('images_v2').insert({
      ...args,
      id,
      createdAt,
      xid: await generateXID(ctx, 'images_v2'),
    })

    // await ctx.scheduler.runAfter(0, internal.action.generateImageVisionData.run, { imageId: id })
    return id
  },
})

export const remove = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.table('images_v2').getX('id', args.id).delete()
  },
})

// * http
export const serve = httpAction(async (ctx, request) => {
  const [imageId] = parseUrlToImageId(request.url)
  const image = imageId
    ? await ctx.runQuery(internal.db.images.getDoc, {
        imageId,
      })
    : null

  if (!image) {
    return new Response('Not Found', { status: 404 })
  }

  const blob = await ctx.storage.get(image.fileId)
  if (!blob) {
    console.error('unable to get blob for fileId:', image.fileId, imageId)
    return new Response('Internal Server Error', { status: 500 })
  }

  const { download } = getQuery(request.url)
  if (download !== undefined) {
    return new Response(blob, {
      headers: {
        'Content-Disposition': `attachment; filename="${imageId}.${image.format}"`,
      },
    })
  }

  return new Response(blob)
})

export const serveUrl = httpAction(async (ctx, request) => {
  const [imageId] = parseUrlToImageId(request.url)
  const image = imageId
    ? await ctx.runQuery(internal.db.images.getDoc, {
        imageId,
      })
    : null

  if (!image) {
    return new Response('Not Found', { status: 404 })
  }

  if (image.sourceUrl.startsWith('https://fal.media/')) {
    return new Response(image.sourceUrl)
  }

  const url = await ctx.storage.getUrl(image.fileId)
  if (!url) {
    throw new Error('Unable to get url for imageId: ' + image.id)
  }

  return new Response(url)
})

function parseUrlToImageId(url: string) {
  const filename = parseFilename(url, { strict: false })
  const [uid, ext] = filename?.split('.') ?? []
  return [uid, ext] as const
}

export const listAllImagesNotInCollection = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const viewer = await ctx.viewerX()
    const result = await ctx
      .table('images_v2', 'ownerId', (q) => q.eq('ownerId', viewer._id))
      .order('desc')
      .paginate(args.paginationOpts)
      .map(async (image) => {
        const collection = await image.edge('collections').first()
        return collection ? null : await getImageV2Edges(ctx, image)
      })

    return {
      ...result,
      page: result.page.filter((i) => i !== null),
    }
  },
})

export const listMyImages = query({
  args: {
    paginationOpts: paginationOptsValidator,
    order: v.optional(literals('asc', 'desc')),
  },
  handler: async (ctx, { paginationOpts, order = 'desc' }) => {
    const viewerId = ctx.viewerId
    if (!viewerId) return emptyPage()

    return await ctx
      .table('images_v2', 'ownerId', (q) => q.eq('ownerId', viewerId))
      .order(order)
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .paginate(paginationOpts)
      .map((image) => getImageV2Edges(ctx, image))
  },
  returns: v.object({ ...paginatedReturnFields, page: v.array(imagesReturn) }),
})
