import { defineEnt } from 'convex-ents'
import { entityScheduledDeletionDelay, literals, v } from '../values'

const captionMetadataFields = {
  type: v.literal('caption'),
  version: v.number(),
  modelId: v.string(),
  modelName: v.optional(v.string()),
  title: v.string(),
  description: v.string(),
  ocr: v.array(v.string()),
}

const generationMetadataFields = {
  type: v.literal('generation'),
  version: v.number(),

  generationType: v.optional(v.string()),
  workflow: v.optional(v.string()),

  modelId: v.string(),
  modelName: v.string(),
  provider: v.string(),
  prompt: v.string(),

  negativePrompt: v.optional(v.string()),
  n: v.optional(v.number()),
  width: v.optional(v.number()),
  height: v.optional(v.number()),
  size: v.optional(v.string()),
  seed: v.optional(v.number()),
  guidanceScale: v.optional(v.number()),
  steps: v.optional(v.number()),
  loras: v.optional(
    v.array(
      v.object({
        path: v.string(),
        scale: v.optional(v.number()),
      }),
    ),
  ),

  nthInBatch: v.optional(v.number()),
  cost: v.optional(v.number()),
}

const nsfwProbabilityMetadataFields = {
  type: v.literal('nsfwProbability'),
  nsfwProbability: v.number(),
}

const messageMetadataFields = {
  type: v.literal('message'),
  role: v.string(),
  name: v.optional(v.string()),
  text: v.string(),
  messageId: v.optional(v.string()),
  threadId: v.optional(v.string()),
}

export const imagesMetadataSchemaFields = {
  type: literals('caption', 'generation', 'nsfwProbability', 'message'),
  data: v.union(
    v.object(captionMetadataFields),
    v.object(generationMetadataFields),
    v.object(nsfwProbabilityMetadataFields),
    v.object(messageMetadataFields),
  ),
}

export const imagesMetadataEnt = defineEnt(imagesMetadataSchemaFields)
  .deletion('scheduled', {
    delayMs: entityScheduledDeletionDelay,
  })
  .index('type', ['data.type'])
  .edge('image', {
    to: 'images_v2',
    field: 'imageId',
  })
