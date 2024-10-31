import { defineEnt } from 'convex-ents'
import { v } from '../../values'
import { OperationsEventLogSchemaFields } from './validators'

export const operationsEventLogEnt = defineEnt(OperationsEventLogSchemaFields).field('ack', v.boolean(), {
  index: true,
})
