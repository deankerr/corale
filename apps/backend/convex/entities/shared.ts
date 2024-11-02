import { literals, v } from '../values'

export const MessageRoles = literals('system', 'assistant', 'user')

export const ModelParametersSchemaFields = {
  maxTokens: v.optional(v.number()),
  temperature: v.optional(v.number()),
  topP: v.optional(v.number()),
  topK: v.optional(v.number()),
  stop: v.optional(v.array(v.string())),
  repetitionPenalty: v.optional(v.number()),
  frequencyPenalty: v.optional(v.number()),
  presencePenalty: v.optional(v.number()),
}

export const TextToImageInputs = v.object({
  type: v.literal('textToImage'),
  modelId: v.string(),
  workflow: v.optional(v.string()),

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
})
