import { defineEnt } from 'convex-ents'
import { v } from '../../values'
import { GenerationSchemaFields } from './validators'

export const generationsEnt = defineEnt(GenerationSchemaFields)
  .field('xid', v.string(), { unique: true })
  .index('status', ['status'])
  .index('runId', ['runId'])
  .index('ownerId', ['ownerId'])
