import { literals, v, withSystemFields } from '../../values'

const CaptionMetadataFields = {
  type: v.literal('caption'),
  version: v.number(),
  modelId: v.string(),
  modelName: v.optional(v.string()),
  title: v.string(),
  description: v.string(),
  ocr: v.array(v.string()),
}

const GenerationMetadataFields = {
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

const NsfwProbabilityMetadataFields = {
  type: v.literal('nsfwProbability'),
  nsfwProbability: v.number(),
}

const MessageMetadataFields = {
  type: v.literal('message'),
  role: v.string(),
  name: v.optional(v.string()),
  text: v.string(),
  messageId: v.optional(v.string()),
  threadId: v.optional(v.string()),
}

export const ImagesMetadataSchemaFields = {
  type: literals('caption', 'generation', 'nsfwProbability', 'message'),
  data: v.union(
    v.object(CaptionMetadataFields),
    v.object(GenerationMetadataFields),
    v.object(NsfwProbabilityMetadataFields),
    v.object(MessageMetadataFields),
  ),
}

export const ImagesMetadataReturn = v.object(
  withSystemFields('images_metadata_v2', {
    ...ImagesMetadataSchemaFields,
    imageId: v.id('images_v2'),
    xid: v.string(),
  }),
)
