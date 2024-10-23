import { defineEnt } from 'convex-ents'
import { entityScheduledDeletionDelay, literals, v } from '../values'

// * Texts
export const textSchemaFields = {
  type: literals('prompt', 'message'),
  title: v.optional(v.string()),
  content: v.string(),
  updatedAt: v.number(),
  runId: v.optional(v.id('runs')),
}

export const textsEnt = defineEnt(textSchemaFields)
  .deletion('scheduled', { delayMs: entityScheduledDeletionDelay })
  .edge('user')
  .index('userId_type', ['userId', 'type'])
  .index('runId', ['runId'])
