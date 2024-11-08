import { defineEnt } from 'convex-ents'
import { deletionDelayTime } from '../../constants'
import { pick, v, withSystemFields } from '../../values'
import { ChatModelReturn } from '../chatModels/validators'
import { updateKvValidator } from '../kvMetadata'
import { MessageReturn } from './messages/models'

export const ThreadSchemaFields = {
  title: v.optional(v.string()),
  instructions: v.optional(v.string()), // TODO deprecate
  favourite: v.optional(v.boolean()),
  kvMetadata: v.optional(v.record(v.string(), v.string())),
  category: v.optional(v.string()),
}

export const ThreadCreate = v.object({
  title: v.optional(v.string()),
  kvMetadata: v.optional(v.record(v.string(), v.string())),
  category: v.optional(v.string()),
})

export const ThreadUpdate = v.object({
  threadId: v.string(),
  fields: v.object({
    title: v.optional(v.string()),
    favourite: v.optional(v.boolean()),
    kvMetadata: v.optional(updateKvValidator),
    category: v.optional(v.string()),
  }),
})

export const ThreadReturn = v.object(
  withSystemFields('threads', {
    title: v.optional(v.string()),
    favourite: v.optional(v.boolean()),
    kvMetadata: v.optional(v.record(v.string(), v.string())),
    instructions: v.optional(v.string()),
    category: v.optional(v.string()),

    // ent fields
    xid: v.string(),
    updatedAtTime: v.number(),
    userId: v.id('users'),
  }),
)

export const ThreadWithDetailsReturn = v.object({
  ...ThreadReturn.fields,
  latestMessage: v.optional(MessageReturn),
  model: v.optional(v.object({ ...pick(ChatModelReturn.fields, ['modelId', 'name', 'creatorName']) })),
})

export const threadsEnt = defineEnt(ThreadSchemaFields)
  .deletion('scheduled', { delayMs: deletionDelayTime })
  .field('xid', v.string(), { unique: true })
  .field('updatedAtTime', v.number())
  .edges('messages', { ref: true, deletion: 'soft' })
  .edges('runs', { ref: true, deletion: 'soft' })
  .edge('user')
