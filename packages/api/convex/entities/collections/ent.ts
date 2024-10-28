import { defineEnt } from 'convex-ents'
import { scheduledDeletionDelayMS, v } from '../../values'
import { CollectionSchemaFields } from './validators'

export const collectionsEnt = defineEnt(CollectionSchemaFields)
  .deletion('scheduled', { delayMs: scheduledDeletionDelayMS })
  .field('xid', v.string(), { unique: true })
  .edge('user', { field: 'ownerId' })
  .edges('images_v2')
