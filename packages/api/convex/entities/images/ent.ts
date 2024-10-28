import { defineEnt } from 'convex-ents'
import { deletionDelayTime } from '../../constants'
import { v } from '../../values'
import { ImageSchemaFields } from './validators'

export const imagesEnt = defineEnt(ImageSchemaFields)
  .deletion('scheduled', { delayMs: deletionDelayTime })
  .field('xid', v.string(), { unique: true })
  .index('generationId', ['generationId'])
  .index('ownerId', ['ownerId'])
  .index('ownerId_sourceUrl', ['ownerId', 'sourceUrl'])
  .index('runId', ['runId'])
  .index('fileId', ['fileId'])
  .edges('images_metadata_v2', { to: 'images_metadata_v2', ref: 'imageId', deletion: 'soft' })
  .edges('collections')
