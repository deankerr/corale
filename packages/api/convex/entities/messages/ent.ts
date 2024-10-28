import { defineEnt } from 'convex-ents'
import { literals, scheduledDeletionDelayMS, v } from '../../values'
import { MessageSchemaFields } from './validators'

export const messagesEnt = defineEnt(MessageSchemaFields)
  .deletion('scheduled', { delayMs: scheduledDeletionDelayMS })
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
