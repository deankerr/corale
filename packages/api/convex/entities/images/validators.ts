import { v, withSystemFields } from '../../values'

export const ImageSchemaFields = {
  sourceUrl: v.string(),
  sourceType: v.string(),
  fileId: v.id('_storage'),
  format: v.string(),
  width: v.number(),
  height: v.number(),
  blurDataUrl: v.string(),
  color: v.string(),

  generationId: v.optional(v.id('generations_v2')),
  runId: v.string(),
  createdAt: v.optional(v.number()),
  ownerId: v.id('users'),
}

export const ImageReturn = v.object(
  withSystemFields('images_v2', {
    ...ImageSchemaFields,
    xid: v.string(),
    collectionIds: v.array(v.id('collections')),
  }),
)
