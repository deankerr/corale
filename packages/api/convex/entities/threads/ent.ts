import { defineEnt } from 'convex-ents'
import { scheduledDeletionDelayMS, v } from '../../values'
import { ThreadSchemaFields } from './validators'

export const threadsEnt = defineEnt(ThreadSchemaFields)
  .deletion('scheduled', { delayMs: scheduledDeletionDelayMS })
  .field('xid', v.string(), { unique: true })
  .field('updatedAtTime', v.number())
  .edges('messages', { ref: true, deletion: 'soft' })
  .edges('runs', { ref: true, deletion: 'soft' })
  .edge('user')
