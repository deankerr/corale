import { literals, v, withSystemFields } from '../../values'

export const TextSchemaFields = {
  type: literals('prompt', 'message'),
  title: v.optional(v.string()),
  content: v.string(),
  updatedAt: v.number(),
  runId: v.optional(v.id('runs')),
}

export const TextReturn = v.object(
  withSystemFields('texts', {
    ...TextSchemaFields,
    userId: v.id('users'),
  }),
)

export const TextPromptReturn = v.object(
  withSystemFields('texts', {
    title: v.string(),
    content: v.string(),
    type: v.literal('prompt'),
    userId: v.id('users'),
    updatedAt: v.number(),
  }),
)
