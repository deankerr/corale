import { defineEnt } from 'convex-ents'
import { entityScheduledDeletionDelay, v } from '../../values'
import { PatternSchemaFields } from './validators'

export const patternsEnt = defineEnt(PatternSchemaFields)
  .deletion('scheduled', { delayMs: entityScheduledDeletionDelay })
  .field('xid', v.string(), { unique: true })
  .field('updatedAt', v.number())
  .field('lastUsedAt', v.number())
  .edge('user')
