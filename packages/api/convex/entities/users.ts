import { defineEnt } from 'convex-ents'
import { entityScheduledDeletionDelay, literals, v } from '../values'

export const userSchemaFields = {
  name: v.string(),
  imageUrl: v.string(),
  role: literals('user', 'admin'),
}

export const usersEnt = defineEnt(userSchemaFields)
  .deletion('scheduled', { delayMs: entityScheduledDeletionDelay })
  .field('tokenIdentifier', v.string(), { unique: true })
  .edges('users_api_keys', { ref: true })
  .edges('audio', { ref: true, deletion: 'soft' })
  .edges('collections', { ref: 'ownerId', deletion: 'soft' })
  .edges('texts', { ref: 'userId', deletion: 'soft' })
  .edges('messages', { ref: true, deletion: 'soft' })
  .edges('threads', { ref: true, deletion: 'soft' })
  .edges('patterns', { ref: true, deletion: 'soft' })
  .edges('runs', { ref: true, deletion: 'soft' })
