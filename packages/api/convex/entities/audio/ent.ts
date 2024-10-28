import { defineEnt } from 'convex-ents'
import { scheduledDeletionDelayMS, v } from '../../values'
import { AudioSchemaFields } from './validators'

export const audioEnt = defineEnt(AudioSchemaFields)
  .deletion('scheduled', { delayMs: scheduledDeletionDelayMS })
  .field('xid', v.string(), { unique: true })
  .edge('user')
