import { defineEnt } from 'convex-ents'
import { deletionDelayTime } from '../../constants'
import { ImagesMetadataSchemaFields } from './validators'

export const imagesMetadataEnt = defineEnt(ImagesMetadataSchemaFields)
  .deletion('scheduled', {
    delayMs: deletionDelayTime,
  })
  .index('type', ['data.type'])
  .edge('image', {
    to: 'images_v2',
    field: 'imageId',
  })
