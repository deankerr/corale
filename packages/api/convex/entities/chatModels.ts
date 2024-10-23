import { defineEnt } from 'convex-ents'
import { v } from '../values'

export const chatModelSchemaFields = {
  name: v.string(),
  description: v.string(),
  creatorName: v.string(),
  created: v.number(),
  link: v.string(),

  license: v.string(),
  tags: v.array(v.string()),
  coverImageUrl: v.optional(v.string()),

  provider: v.string(),
  modelId: v.string(),

  pricing: v.object({
    tokenInput: v.number(),
    tokenOutput: v.number(),
    imageInput: v.optional(v.number()),
    imageOutput: v.optional(v.number()),
  }),

  moderated: v.boolean(),
  available: v.boolean(),
  hidden: v.boolean(),
  internalScore: v.number(),

  numParameters: v.optional(v.number()),
  contextLength: v.number(),
  tokenizer: v.string(),
  stop: v.optional(v.array(v.string())),
  maxOutputTokens: v.optional(v.number()),
}

export const chatModelsEnt = defineEnt(chatModelSchemaFields).field('resourceKey', v.string(), {
  unique: true,
})
