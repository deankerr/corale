import { defineEnt } from 'convex-ents'
import { v } from '../values'

export const speechSchemaFields = {
  fileId: v.optional(v.id('_storage')),
  resourceKey: v.string(),
  textHash: v.string(),
}

export const speechEnt = defineEnt(speechSchemaFields).index('textHash_resourceKey', ['textHash', 'resourceKey'])
