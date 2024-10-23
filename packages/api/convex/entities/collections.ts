import { defineEnt } from 'convex-ents'
import { entityScheduledDeletionDelay, v } from '../values'

export const collectionSchemaFields = {
  title: v.string(),
  kvMetadata: v.optional(v.record(v.string(), v.string())),
}

export const collectionsEnt = defineEnt(collectionSchemaFields)
  .deletion('scheduled', { delayMs: entityScheduledDeletionDelay })
  .field('xid', v.string(), { unique: true })
  .edge('user', { field: 'ownerId' })
  .edges('images_v2')
