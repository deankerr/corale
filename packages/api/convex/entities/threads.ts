import { defineEnt } from 'convex-ents'
import { entityScheduledDeletionDelay, v } from '../values'

export const threadSchemaFields = {
  title: v.optional(v.string()),
  instructions: v.optional(v.string()),
  favourite: v.optional(v.boolean()),
  kvMetadata: v.optional(v.record(v.string(), v.string())),

  updatedAtTime: v.number(),
}

export const threadsEnt = defineEnt(threadSchemaFields)
  .deletion('scheduled', { delayMs: entityScheduledDeletionDelay })
  .field('xid', v.string(), { unique: true })
  .edges('messages', { ref: true, deletion: 'soft' })
  .edges('runs', { ref: true, deletion: 'soft' })
  .edge('user')
