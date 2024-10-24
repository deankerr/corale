import { defineEnt } from 'convex-ents'
import { literals, v } from '../values'
import { modelParametersSchemaFields } from './shared'

export const runSchemaFields = {
  status: literals('queued', 'active', 'done', 'failed'),
  stream: v.boolean(),
  patternId: v.optional(v.id('patterns')),

  model: v.object({
    id: v.string(),
    provider: v.optional(v.string()),
    ...modelParametersSchemaFields,
  }),

  options: v.optional(
    v.object({
      maxMessages: v.optional(v.number()),
      maxCompletionTokens: v.optional(v.number()),
    }),
  ),

  // * override pattern instructions (if pattern is set)
  instructions: v.optional(v.string()),
  // * append to instructions (from pattern if set)
  additionalInstructions: v.optional(v.string()),

  // * run stats
  timings: v.object({
    queuedAt: v.number(),
    startedAt: v.optional(v.number()),
    endedAt: v.optional(v.number()),
    firstTokenAt: v.optional(v.number()),
  }),

  usage: v.optional(
    v.object({
      cost: v.optional(v.number()),
      finishReason: v.string(),
      promptTokens: v.number(),
      completionTokens: v.number(),
      modelId: v.string(),
      requestId: v.string(),
    }),
  ),

  // * results
  results: v.optional(
    v.array(
      v.object({
        type: v.literal('message'),
        id: v.id('messages'),
      }),
    ),
  ),

  errors: v.optional(
    v.array(
      v.object({
        code: v.string(),
        message: v.string(),
        data: v.optional(v.any()),
      }),
    ),
  ),

  // * post-run metadata from openrouter
  providerMetadata: v.optional(v.record(v.string(), v.any())),
  // * user metadata
  kvMetadata: v.record(v.string(), v.string()),
  updatedAt: v.number(),
}

export const runsEnt = defineEnt(runSchemaFields)
  .deletion('soft')
  .field('xid', v.string(), { unique: true })
  .edge('thread')
  .edge('user')
