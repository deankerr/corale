import { defineEnt } from 'convex-ents'
import { deletionDelayTime } from '../../constants'
import { v } from '../../values'
import { PatternSchemaFields } from './validators'

export const patternsEnt = defineEnt(PatternSchemaFields)
  .deletion('scheduled', { delayMs: deletionDelayTime })
  .field('xid', v.string(), { unique: true })
  .field('updatedAt', v.number())
  .field('lastUsedAt', v.number())
  .edge('user')
