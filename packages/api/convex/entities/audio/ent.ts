import { defineEnt } from 'convex-ents'
import { scheduledDeletionDelayMS, v } from '../../values'

export const audioEnt = defineEnt({
  fileId: v.id('_storage'),

  generationData: v.object({
    prompt: v.string(),
    modelId: v.string(),
    modelName: v.string(),
    endpointId: v.string(),
    duration: v.optional(v.number()),
  }),
})
  .deletion('scheduled', { delayMs: scheduledDeletionDelayMS })
  .field('xid', v.string(), { unique: true })
  .edge('user')
