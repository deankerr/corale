import { defineEnt } from 'convex-ents'
import { deletionDelayTime } from '../../constants'
import { v } from '../../values'
import { CollectionSchemaFields } from './validators'

export const collectionsEnt = defineEnt(CollectionSchemaFields)
  .deletion('scheduled', { delayMs: deletionDelayTime })
  .field('xid', v.string(), { unique: true })
  .edge('user', { field: 'ownerId' })
  .edges('images_v2')
