import { v, withSystemFields } from '../../values'
import { MessageRoles, ModelParameters } from '../shared'

export const PatternSchemaFields = {
  name: v.string(),
  description: v.string(),

  model: v.object({
    id: v.string(),
    provider: v.optional(v.string()),
    ...ModelParameters,
  }),

  instructions: v.string(),
  initialMessages: v.array(
    v.object({
      role: MessageRoles,
      name: v.optional(v.string()),
      text: v.string(),
      channel: v.optional(v.string()),
    }),
  ),

  dynamicMessage: v.optional(
    v.object({
      role: v.optional(MessageRoles),
      name: v.optional(v.string()),
      text: v.string(),
      channel: v.optional(v.string()),

      depth: v.optional(v.number()), // 0 = last message, 1 = one message back, etc.
    }),
  ),

  dynamicMessages: v.array(
    v.object({
      message: v.object({
        role: MessageRoles,
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

export const PatternCreate = PatternSchemaFields

export const PatternUpdate = PatternSchemaFields

export const PatternReturn = v.object({
  ...withSystemFields('patterns', {
    ...PatternSchemaFields,
    xid: v.string(),
    updatedAt: v.number(),
    lastUsedAt: v.number(),
    userId: v.id('users'),
  }),
})
