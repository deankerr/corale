import { defineEnt } from 'convex-ents'
import { deletionDelayTime } from '../../constants'
import { TextSchemaFields } from './validators'

export const textsEnt = defineEnt(TextSchemaFields)
  .deletion('scheduled', { delayMs: deletionDelayTime })
  .edge('user')
  .index('userId_type', ['userId', 'type'])
  .index('runId', ['runId'])
