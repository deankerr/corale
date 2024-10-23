import { defineEnt } from 'convex-ents'
import { entityScheduledDeletionDelay, literals, v } from '../values'
import { modelParametersSchemaFields } from './shared'

export const patternSchemaFields = {
  name: v.string(),
  description: v.string(),

  model: v.object({
    id: v.string(),
    provider: v.optional(v.string()),
    ...modelParametersSchemaFields,
  }),

  instructions: v.string(),
  initialMessages: v.array(
    v.object({
      role: literals('system', 'assistant', 'user'),
      name: v.optional(v.string()),
      text: v.string(),
      channel: v.optional(v.string()),
    }),
  ),
  dynamicMessages: v.array(
    v.object({
      message: v.object({
        role: literals('system', 'assistant', 'user'),
        name: v.optional(v.string()),
        text: v.string(),
        channel: v.optional(v.string()),
      }),
    }),
  ),

  options: v.optional(
    v.object({
      maxMessages: v.optional(v.number()),
      maxCompletionTokens: v.optional(v.number()),
    }),
  ),

  kvMetadata: v.record(v.string(), v.string()),
}

export const patternsEnt = defineEnt(patternSchemaFields)
  .deletion('scheduled', { delayMs: entityScheduledDeletionDelay })
  .field('xid', v.string(), { unique: true })
  .field('updatedAt', v.number())
  .field('lastUsedAt', v.number())
  .edge('user')
