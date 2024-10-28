import { defineEnt } from 'convex-ents'
import { scheduledDeletionDelayMS } from '../../values'
import { ImagesMetadataSchemaFields } from './validators'

export const imagesMetadataEnt = defineEnt(ImagesMetadataSchemaFields)
  .deletion('scheduled', {
    delayMs: scheduledDeletionDelayMS,
  })
  .index('type', ['data.type'])
  .edge('image', {
    to: 'images_v2',
    field: 'imageId',
  })
