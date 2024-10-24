import { defineEnt } from 'convex-ents'
import { entityScheduledDeletionDelay, v } from '../values'

export const imageSchemaFields = {
  sourceUrl: v.string(),
  sourceType: v.string(),
  fileId: v.id('_storage'),
  format: v.string(),
  width: v.number(),
  height: v.number(),
  blurDataUrl: v.string(),
  color: v.string(),

  generationId: v.optional(v.id('generations_v2')),
  runId: v.string(),
  createdAt: v.optional(v.number()),
  ownerId: v.id('users'),
}

export const imagesEnt = defineEnt(imageSchemaFields)
  .deletion('scheduled', { delayMs: entityScheduledDeletionDelay })
  .field('xid', v.string(), { unique: true })
  .index('generationId', ['generationId'])
  .index('ownerId', ['ownerId'])
  .index('ownerId_sourceUrl', ['ownerId', 'sourceUrl'])
  .index('runId', ['runId'])
  .index('fileId', ['fileId'])
  .edges('images_metadata_v2', { to: 'images_metadata_v2', ref: 'imageId', deletion: 'soft' })
  .edges('collections')
