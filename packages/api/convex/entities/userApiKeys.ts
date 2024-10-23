import { defineEnt } from 'convex-ents'
import { entityScheduledDeletionDelay, v } from '../values'

export const usersApiKeysSchemaFields = {
  valid: v.boolean(),
}

export const usersApiKeysEnt = defineEnt(usersApiKeysSchemaFields)
  .deletion('scheduled', { delayMs: entityScheduledDeletionDelay })
  .field('secret', v.string(), { unique: true })
  .edge('user')
