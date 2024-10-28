import { defineEnt } from 'convex-ents'
import { scheduledDeletionDelayMS, v } from '../../values'

export const threadsEnt = defineEnt({
  title: v.optional(v.string()),
  instructions: v.optional(v.string()), // TODO deprecate
  favourite: v.optional(v.boolean()),
  kvMetadata: v.optional(v.record(v.string(), v.string())),
})
  .deletion('scheduled', { delayMs: scheduledDeletionDelayMS })
  .field('xid', v.string(), { unique: true })
  .field('updatedAtTime', v.number())
  .edges('messages', { ref: true, deletion: 'soft' })
  .edges('runs', { ref: true, deletion: 'soft' })
  .edge('user')
