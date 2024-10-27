import { defineEnt } from 'convex-ents'
import { v } from '../../values'
import { ChatModelSchemaFields } from './validators'

export const chatModelsEnt = defineEnt(ChatModelSchemaFields).field('resourceKey', v.string(), {
  unique: true,
})
