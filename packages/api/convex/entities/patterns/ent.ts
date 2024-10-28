import { defineEnt } from 'convex-ents'
import { scheduledDeletionDelayMS, v } from '../../values'
import { PatternSchemaFields } from './validators'

export const patternsEnt = defineEnt(PatternSchemaFields)
  .deletion('scheduled', { delayMs: scheduledDeletionDelayMS })
  .field('xid', v.string(), { unique: true })
  .field('updatedAt', v.number())
  .field('lastUsedAt', v.number())
  .edge('user')
