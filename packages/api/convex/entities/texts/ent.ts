import { defineEnt } from 'convex-ents'
import { scheduledDeletionDelayMS } from '../../values'
import { TextSchemaFields } from './validators'

export const textsEnt = defineEnt(TextSchemaFields)
  .deletion('scheduled', { delayMs: scheduledDeletionDelayMS })
  .edge('user')
  .index('userId_type', ['userId', 'type'])
  .index('runId', ['runId'])
