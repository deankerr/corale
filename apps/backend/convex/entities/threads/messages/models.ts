import { defineEnt } from 'convex-ents'
import { deletionDelayTime } from '../../../constants'
import { v, withSystemFields } from '../../../values'
import { updateKvValidator } from '../../kvMetadata'
import { MessageRoles } from '../../shared'

export const MessageSchemaFields = {
  role: MessageRoles,
  name: v.optional(v.string()),
  text: v.optional(v.string()),
  channel: v.optional(v.string()),
  kvMetadata: v.optional(v.record(v.string(), v.string())),

  runId: v.optional(v.id('runs')),
}

export const MessageCreate = v.object({
  role: MessageRoles,
  name: v.optional(v.string()),
  text: v.optional(v.string()),
  channel: v.optional(v.string()),
  kvMetadata: v.optional(v.record(v.string(), v.string())),

  threadId: v.string(),
  runId: v.optional(v.id('runs')),
})

export const MessageUpdate = v.object({
  messageId: v.string(),
  fields: v.object({
    role: v.optional(MessageRoles),
    name: v.optional(v.string()),
    text: v.optional(v.string()),
    channel: v.optional(v.string()),
    kvMetadata: v.optional(updateKvValidator),
  }),
})

export const MessageReturn = v.object(
  withSystemFields('messages', {
    role: MessageRoles,
    name: v.optional(v.string()),
    text: v.optional(v.string()),
    channel: v.optional(v.string()),
    kvMetadata: v.optional(v.record(v.string(), v.string())),
    runId: v.optional(v.string()),

    // ent fields
    xid: v.string(),
    series: v.number(),
    threadId: v.id('threads'),
    userId: v.id('users'),
  }),
)

export const messagesEnt = defineEnt(MessageSchemaFields)
  .deletion('scheduled', { delayMs: deletionDelayTime })
  .field('series', v.number(), { index: true })
  .field('xid', v.string(), { index: true })
  .edge('thread')
  .edge('user')
  .index('threadId_series', ['threadId', 'series'])
  .index('threadId_role', ['threadId', 'role'])
  .index('threadId_name', ['threadId', 'name'])
  .index('threadId_role_name', ['threadId', 'role', 'name'])
  .index('threadId_channel', ['threadId', 'channel'])
  .index('runId', ['runId'])
  .searchIndex('search_text_threadId_role_name', {
    searchField: 'text',
    filterFields: ['threadId', 'role', 'name'],
  })
