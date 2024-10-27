import { defineEnt } from 'convex-ents'
import { entityScheduledDeletionDelay } from '../../values'
import { TextSchemaFields } from './validators'

export const textsEnt = defineEnt(TextSchemaFields)
  .deletion('scheduled', { delayMs: entityScheduledDeletionDelay })
  .edge('user')
  .index('userId_type', ['userId', 'type'])
  .index('runId', ['runId'])
