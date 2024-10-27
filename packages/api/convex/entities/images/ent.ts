import { defineEnt } from 'convex-ents'
import { entityScheduledDeletionDelay, v } from '../../values'
import { ImageSchemaFields } from './validators'

export const imagesEnt = defineEnt(ImageSchemaFields)
  .deletion('scheduled', { delayMs: entityScheduledDeletionDelay })
  .field('xid', v.string(), { unique: true })
  .index('generationId', ['generationId'])
  .index('ownerId', ['ownerId'])
  .index('ownerId_sourceUrl', ['ownerId', 'sourceUrl'])
  .index('runId', ['runId'])
  .index('fileId', ['fileId'])
  .edges('images_metadata_v2', { to: 'images_metadata_v2', ref: 'imageId', deletion: 'soft' })
  .edges('collections')
