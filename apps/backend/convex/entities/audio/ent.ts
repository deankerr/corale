import { defineEnt } from 'convex-ents'
import { deletionDelayTime } from '../../constants'
import { v } from '../../values'
import { AudioSchemaFields } from './validators'

export const audioEnt = defineEnt(AudioSchemaFields)
  .deletion('scheduled', { delayMs: deletionDelayTime })
  .field('xid', v.string(), { unique: true })
  .edge('user')
