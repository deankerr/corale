import { internalQuery } from '../../functions'
import { v } from '../../values'
import { getEntityX } from '../helpers/xid'

export const getCollectionMetadata = internalQuery({
  args: {
    collectionId: v.string(),
  },
  handler: async (ctx, { collectionId }) => {
    const collection = await getEntityX(ctx, 'collections', collectionId)
    const images = await collection.edgeX('images_v2').map(async (image) => ({
      ...image,
      metadata: await image.edgeX('images_metadata_v2'),
    }))
    return JSON.stringify(images)
  },
})
