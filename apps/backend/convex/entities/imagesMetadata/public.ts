import { mutation, query } from '../../functions'
import { ConvexError, v } from '../../values'
import { getImageWriterX, getImageX } from '../images/db'
import { ImagesMetadataReturn, ImagesMetadataSchemaFields } from './validators'

export const add = mutation({
  args: {
    imageId: v.string(),
    fields: ImagesMetadataSchemaFields['data'],
  },
  handler: async (ctx, { imageId, fields }) => {
    const user = await ctx.viewerX()
    const image = await getImageWriterX(ctx, { imageId })
    if (image.ownerId !== user._id) throw new ConvexError('unauthorized')
    if (fields.type !== 'message') throw new ConvexError('invalid metadata type')
    return await ctx
      .table('images_metadata_v2')
      .insert({ imageId: image._id, type: fields.type, data: fields })
  },
  returns: v.string(),
})

export const get = query({
  args: {
    imageId: v.string(),
  },
  handler: async (ctx, { imageId }) => {
    const image = await getImageX(ctx, { imageId })
    const metadata = (
      await ctx.table('images_metadata_v2', 'imageId', (q) => q.eq('imageId', image._id))
    ).map((metadata) => ({ ...metadata, xid: image.xid }))
    return metadata
  },
  returns: v.array(ImagesMetadataReturn),
})
