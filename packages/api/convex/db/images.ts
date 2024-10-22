import { getQuery, parseFilename } from 'ufo'
import { internal } from '../_generated/api'
import { httpAction } from '../_generated/server'
import type { FalTextToImageOutput } from '../action/generateTextToImage'
import { internalMutation, internalQuery, mutation, query } from '../functions'
import { emptyPage, paginatedReturnFields } from '../lib/utils'
import { getImageModel } from '../provider/imageModels'
import { imagesMetadataV2Fields, imagesV2Fields } from '../schema'
import type { Doc, Ent, QueryCtx, TextToImageInputs } from '../types'
import { ConvexError, literals, omit, paginationOptsValidator, v } from '../values'
import { generateXID, getEntity, getEntityWriterX, getEntityX } from './helpers/xid'

export const imagesReturn = v.object({
  _id: v.id('images_v2'),
  _creationTime: v.number(),
  sourceUrl: v.string(),
  sourceType: v.string(),
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
  // fields
  xid: v.string(),
})

export const getImageV2Edges = async (ctx: QueryCtx, image: Ent<'images_v2'>) => {
  return {
    ...image.doc(),
    collectionIds: await image.edge('collections').map((c) => c._id),
  }
}

export const getDoc = internalQuery({
  args: {
    imageId: v.string(),
  },
  handler: async (ctx, { imageId }) => {
    return await getEntity(ctx, 'images_v2', imageId)
  },
})

export const getByRunId = query({
  args: {
    runId: v.string(),
  },
  handler: async (ctx, { runId }) => {
    return await ctx
      .table('images_v2', 'runId', (q) => q.eq('runId', runId))
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
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

    const xid = generateXID()
    const _id = await ctx.skipRules.table('images_v2').insert({
      ...args,
      createdAt,
      xid,
    })

    const generation = args.generationId ? await ctx.table('generations_v2').get(args.generationId) : null
    if (generation) {
      try {
        const data = createGenerationMetadata(generation, args.sourceUrl)
        await ctx.table('images_metadata_v2').insert({ data, type: 'generation', imageId: _id })
      } catch (err) {
        console.error('Failed to get generation metadata', err)
      }
    }

    return xid
  },
})

export const remove = mutation({
  args: {
    imageId: v.string(),
  },
  handler: async (ctx, { imageId }) => {
    const image = await getEntityWriterX(ctx, 'images_v2', imageId)
    return await image.delete()
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
    throw new Error('Unable to get url for imageId: ' + image.xid)
  }

  return new Response(url)
})

function parseUrlToImageId(url: string) {
  const filename = parseFilename(url, { strict: false })
  const [uid, ext] = filename?.split('.') ?? []
  return [uid, ext] as const
}

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

// * metadata
export const addMetadata = mutation({
  args: {
    imageId: v.string(),
    fields: imagesMetadataV2Fields['data'],
  },
  handler: async (ctx, { imageId, fields }) => {
    const user = await ctx.viewerX()
    const image = await getEntityX(ctx, 'images_v2', imageId)
    if (image.ownerId !== user._id) throw new ConvexError('unauthorized')
    if (fields.type !== 'message') throw new ConvexError('invalid metadata type')
    return await ctx.table('images_metadata_v2').insert({ imageId: image._id, type: fields.type, data: fields })
  },
})

export const getMetadata = query({
  args: {
    imageId: v.string(),
  },
  handler: async (ctx, { imageId }) => {
    const image = await getEntityX(ctx, 'images_v2', imageId)
    const metadata = (await ctx.table('images_metadata_v2', 'imageId', (q) => q.eq('imageId', image._id))).map(
      (metadata) => ({ ...metadata, xid: image.xid }),
    )
    return metadata
  },
})

export function createGenerationMetadata(
  generation: Doc<'generations_v2'>,
  sourceUrl: string,
): Extract<Doc<'images_metadata_v2'>['data'], { type: 'generation' }> {
  const input = generation.input as TextToImageInputs & { configId: string }
  const output = generation.output as FalTextToImageOutput
  if (!(input && output && generation.results)) throw new ConvexError('generation metadata missing required fields')

  const model = getImageModel(input.modelId)
  const modelName = model?.name ?? 'unknown'

  const n = input.n ?? 1
  const nthInBatch = (generation.results.findIndex((result) => result.url === sourceUrl) ?? 0) + 1

  const seed = output.seed ?? input.seed

  const metadata: Doc<'images_metadata_v2'>['data'] = {
    type: 'generation',
    ...omit(input, ['configId', 'type', 'n']),
    modelName,
    provider: 'fal',
    n,
    nthInBatch,
    seed,
    version: 2,
    generationType: input.type,
  }

  const pricing = model?.pricing
  const result = generation.results.find((result) => result.url === sourceUrl)

  if (pricing) {
    switch (pricing.type) {
      case 'perMegapixel':
        if (!result?.width || !result?.height) break
        metadata.cost = roundDecimalPlaces((pricing.value * (result.width * result.height)) / 1000000)
        break
      case 'perSecond':
        if (!output.timings?.inference) break
        metadata.cost = roundDecimalPlaces((pricing.value * output.timings.inference) / n)
        break
      case 'perImage':
        metadata.cost = roundDecimalPlaces(pricing.value)
        break
    }
  }

  return metadata
}

function roundDecimalPlaces(value: number, places = 6) {
  return Math.round(value * 10 ** places) / 10 ** places
}
