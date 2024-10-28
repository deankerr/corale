import { ConvexError } from 'convex/values'
import type { MutationCtx, QueryCtx } from '../../types'
import { nullifyDeletedEnt, nullifyDeletedEntWriter } from '../helpers'

export async function getImage(ctx: QueryCtx, { imageId }: { imageId: string }) {
  const docId = ctx.table('images_v2').normalizeId(imageId)
  const image = docId ? await ctx.table('images_v2').get(docId) : await ctx.table('images_v2').get('xid', imageId)
  return nullifyDeletedEnt(image)
}

export async function getImageX(ctx: QueryCtx, { imageId }: { imageId: string }) {
  const image = await getImage(ctx, { imageId })
  if (!image) throw new ConvexError({ message: `Invalid image id`, id: imageId })
  return image
}

export async function getImageWriter(ctx: MutationCtx, { imageId }: { imageId: string }) {
  const docId = ctx.table('images_v2').normalizeId(imageId)
  const image = docId ? await ctx.table('images_v2').get(docId) : await ctx.table('images_v2').get('xid', imageId)
  return nullifyDeletedEntWriter(image)
}

export async function getImageWriterX(ctx: MutationCtx, { imageId }: { imageId: string }) {
  const image = await getImageWriter(ctx, { imageId })
  if (!image) throw new ConvexError({ message: `Invalid image id`, id: imageId })
  return image
}
