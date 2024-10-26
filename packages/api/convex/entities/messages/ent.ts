import { defineEnt } from 'convex-ents'
import { entityScheduledDeletionDelay, literals, v } from '../../values'

export const messagesEnt = defineEnt({
  role: literals('system', 'assistant', 'user'),
  name: v.optional(v.string()),
  text: v.optional(v.string()),
  channel: v.optional(v.string()),
  kvMetadata: v.optional(v.record(v.string(), v.string())),

  runId: v.optional(v.id('runs')),
})
  .deletion('scheduled', { delayMs: entityScheduledDeletionDelay })
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
