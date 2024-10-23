import { defineEnt } from 'convex-ents'
import { entityScheduledDeletionDelay, v } from '../values'

export const audioSchemaFields = {
  fileId: v.id('_storage'),

  generationData: v.object({
    prompt: v.string(),
    modelId: v.string(),
    modelName: v.string(),
    endpointId: v.string(),
    duration: v.optional(v.number()),
  }),
}

export const audioEnt = defineEnt(audioSchemaFields)
  .deletion('scheduled', { delayMs: entityScheduledDeletionDelay })
  .field('xid', v.string(), { unique: true })
  .edge('user')
