import { defineEnt } from 'convex-ents'
import { literals, v } from '../values'

export const operationsEventLogSchemaFields = {
  type: literals('debug', 'info', 'notice', 'warning', 'error'),
  message: v.string(),
  data: v.optional(v.any()),
}

export const operationsEventLogEnt = defineEnt(operationsEventLogSchemaFields).field('ack', v.boolean(), {
  index: true,
})
