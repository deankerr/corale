import { defineEnt } from 'convex-ents'
import { v } from '../../values'
import { RunSchemaFields } from './validators'

export const runsEnt = defineEnt(RunSchemaFields)
  .deletion('soft')
  .field('xid', v.string(), { unique: true })
  .field('updatedAt', v.number())
  .edge('thread')
  .edge('user')
