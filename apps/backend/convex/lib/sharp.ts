'use node'

import { ConvexError, v } from 'convex/values'
import sharp, { type FormatEnum } from 'sharp'
import type { Id } from '../_generated/dataModel'
import { internalAction } from '../functions'
import { fetch } from '../lib/fetch'

type StoredImageFileWithBlurData = {
  fileId: Id<'_storage'>
  metadata: {
    color: string
    blurDataUrl: string
    width: number
    height: number
    format: string
  }
}

type StoredImageFile = {
  fileId: Id<'_storage'>
  metadata: {
    width: number
    height: number
    format: string
  }
}

const BLUR_FORMAT: keyof FormatEnum = 'png'
const BLUR_SIZE = 8
const BLUR_BRIGHTNESS = 1.25
const BLUR_SATURATION = 1.4

export const storeImageFromUrl = internalAction({
  args: {
    url: v.string(),
  },
  handler: async (ctx, args): Promise<StoredImageFileWithBlurData> => {
    const inputArrayBuffer = await fetch.get(args.url).arrayBuffer()
    const metadata = await createBlurData(inputArrayBuffer)
    const blob = new Blob([inputArrayBuffer], { type: `image/${metadata.format}` })

    const fileId = await ctx.storage.store(blob)
    return { fileId, metadata }
  },
})

export const convertToWebpAndResize = internalAction({
  args: {
    fileId: v.id('_storage'),
    width: v.number(),
  },
  handler: async (ctx, args): Promise<StoredImageFile> => {
    const inputBlob = await ctx.storage.get(args.fileId)
    if (!inputBlob) throw new ConvexError('invalid file id')

    const {
      data,
      info: { width, height, format },
    } = await resizeToWebp(inputBlob, args.width)
    const fileId = await ctx.storage.store(new Blob([data], { type: `image/${format}` }))

    return {
      fileId,
      metadata: {
        width,
        height,
        format,
      },
    }
  },
})

export async function createBlurData(input: ArrayBuffer | Blob) {
  const inputArrayBuffer = input instanceof Blob ? await input.arrayBuffer() : input

  const metadata = await getMetadata(inputArrayBuffer)

  // see https://github.com/joe-bell/plaiceholder/blob/main/packages/plaiceholder/src/index.ts
  const pipeline = sharp(inputArrayBuffer)
    .resize(BLUR_SIZE, BLUR_SIZE, { fit: 'inside' })
    .toFormat(BLUR_FORMAT)
    .modulate({
      brightness: BLUR_BRIGHTNESS,
      saturation: BLUR_SATURATION,
    })

  // dominant hex color
  const color = await pipeline
    .clone()
    .stats()
    .then(({ dominant: { r, g, b } }) => {
      return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
    })

  // base64
  const blur = await pipeline.clone().normalise().toBuffer({ resolveWithObject: true })
  const blurDataUrl = `data:image/${blur.info.format};base64,${blur.data.toString('base64')}`

  return { ...metadata, color, blurDataUrl }
}

export async function resizeToWebp(input: ArrayBuffer | Blob, width: number) {
  const inputArrayBuffer = input instanceof Blob ? await input.arrayBuffer() : input

  const { data, info } = await sharp(inputArrayBuffer).webp().resize({ width }).toBuffer({ resolveWithObject: true })

  return { data, info }
}

export async function getMetadata(input: ArrayBuffer | Blob) {
  const inputArrayBuffer = input instanceof Blob ? await input.arrayBuffer() : input
  const metadata = await sharp(inputArrayBuffer)
    .metadata()
    .then(({ width, height, format }) => {
      if (!(width && height && format)) {
        throw new ConvexError('Failed to get required image metadata')
      }
      return { width, height, format }
    })

  return metadata
}
