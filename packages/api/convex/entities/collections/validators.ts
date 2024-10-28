import { v, withSystemFields } from '../../values'
import { ImageReturn } from '../images/validators'

export const CollectionSchemaFields = {
  title: v.string(),
  kvMetadata: v.optional(v.record(v.string(), v.string())),
}

export const CollectionReturn = v.object(
  withSystemFields('collections', {
    ...CollectionSchemaFields,
    xid: v.string(),
    images: v.array(ImageReturn),
    ownerId: v.id('users'),
  }),
)
