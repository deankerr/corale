import { updateKvValidator } from '../../db/helpers/kvMetadata'
import { deprecated, v, withSystemFields } from '../../values'

export const ThreadCreate = v.object({
  title: v.optional(v.string()),
  kvMetadata: v.optional(v.record(v.string(), v.string())),
})

export const ThreadUpdate = v.object({
  threadId: v.string(),
  fields: v.object({
    title: v.optional(v.string()),
    favourite: v.optional(v.boolean()),
    kvMetadata: v.optional(updateKvValidator),
  }),
})

export const ThreadReturn = v.object(
  withSystemFields('threads', {
    title: v.optional(v.string()),
    favourite: v.optional(v.boolean()),
    kvMetadata: v.optional(v.record(v.string(), v.string())),
    instructions: v.optional(v.string()),
    // ent fields
    xid: v.string(),
    updatedAtTime: v.number(),
    userId: v.id('users'),
  }),
)
