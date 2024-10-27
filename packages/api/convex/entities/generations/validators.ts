import { literals, v, withSystemFields } from '../../values'
import { ImageReturn } from '../images/validators'

export const GenerationSchemaFields = {
  status: literals('queued', 'active', 'done', 'failed'),
  updatedAt: v.number(),
  workflow: v.optional(v.string()),
  input: v.any(),
  output: v.optional(v.any()),
  results: v.optional(
    v.array(
      v.object({
        contentType: v.string(),
        url: v.string(),
        width: v.number(),
        height: v.number(),
      }),
    ),
  ),
  errors: v.optional(v.array(v.any())),
  runId: v.string(),
  ownerId: v.id('users'),
}

export const GenerationReturn = v.object(
  withSystemFields('generations_v2', {
    ...GenerationSchemaFields,
    xid: v.string(),
    images: v.optional(v.array(ImageReturn)),
  }),
)
