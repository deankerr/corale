import { defineEnt } from 'convex-ents'
import { entityScheduledDeletionDelay } from '../../values'
import { ImagesMetadataSchemaFields } from './validators'

export const imagesMetadataEnt = defineEnt(ImagesMetadataSchemaFields)
  .deletion('scheduled', {
    delayMs: entityScheduledDeletionDelay,
  })
  .index('type', ['data.type'])
  .edge('image', {
    to: 'images_v2',
    field: 'imageId',
  })
