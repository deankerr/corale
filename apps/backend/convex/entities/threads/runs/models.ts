import { defineEnt } from 'convex-ents'
import { omit } from 'convex-helpers'
import { literals, pick, v, withSystemFields } from '../../../values'
import { MessageCreate } from '../../messages/validators'
import { MessageRoles, ModelParametersSchemaFields } from '../../shared'

export const RunSchemaFields = {
  status: literals('queued', 'active', 'done', 'failed'),
  stream: v.boolean(),
  patternId: v.optional(v.id('patterns')),

  model: v.object({
    id: v.string(),
    provider: v.optional(v.string()),
    ...ModelParametersSchemaFields,
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

  dynamicMessage: v.optional(
    v.object({
      role: v.optional(MessageRoles),
      name: v.optional(v.string()),
      text: v.string(),
      channel: v.optional(v.string()),

      depth: v.optional(v.number()), // 0 = last message, 1 = one message back, etc.
    }),
  ),

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
  kvMetadata: v.optional(v.record(v.string(), v.string())),
}

export const RunCreate = v.object({
  ...pick(RunSchemaFields, [
    'stream',
    'options',
    'instructions',
    'additionalInstructions',
    'dynamicMessage',
    'kvMetadata',
  ]),
  patternId: v.optional(v.string()),
  model: v.optional(RunSchemaFields.model),
  appendMessages: v.optional(v.array(v.object(omit(MessageCreate.fields, ['threadId'])))),
  threadId: v.string(),
})

export const RunReturn = v.object(
  withSystemFields('runs', {
    ...RunSchemaFields,
    xid: v.string(),
    updatedAt: v.number(),
    threadId: v.id('threads'),
    userId: v.id('users'),
  }),
)

export const runsEnt = defineEnt(RunSchemaFields)
  .deletion('soft')
  .field('xid', v.string(), { unique: true })
  .field('updatedAt', v.number())
  .edge('thread')
  .edge('user')
