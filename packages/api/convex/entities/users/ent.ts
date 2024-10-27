import { defineEnt } from 'convex-ents'
import { entityScheduledDeletionDelay, v } from '../../values'
import { UsersApiKeysSchemaFields, UserSchemaFields } from './validators'

export const usersEnt = defineEnt(UserSchemaFields)
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

export const usersApiKeysEnt = defineEnt(UsersApiKeysSchemaFields)
  .deletion('scheduled', { delayMs: entityScheduledDeletionDelay })
  .field('secret', v.string(), { unique: true })
  .edge('user')
