import { nullable, v, withSystemFields } from '../../values'

export const AudioSchemaFields = {
  fileId: v.id('_storage'),

  generationData: v.object({
    prompt: v.string(),
    modelId: v.string(),
    modelName: v.string(),
    endpointId: v.string(),
    duration: v.optional(v.number()),
  }),
}

export const AudioCreate = v.object({
  fileId: v.id('_storage'),
  prompt: v.string(),
  duration: v.optional(v.number()),
  userId: v.id('users'),
})

export const AudioReturn = v.object(
  withSystemFields('audio', {
    fileId: v.id('_storage'),

    generationData: v.object({
      prompt: v.string(),
      modelId: v.string(),
      modelName: v.string(),
      endpointId: v.string(),
      duration: v.optional(v.number()),
    }),

    fileUrl: nullable(v.string()),
    userId: v.id('users'),
    xid: v.string(),
  }),
)
