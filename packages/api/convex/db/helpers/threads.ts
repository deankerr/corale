import { omit } from 'convex-helpers'
import { ConvexError, v, type AsObjectValidator, type Infer } from 'convex/values'
import type { Ent, QueryCtx } from '../../types'
import { getUserPublicX, userReturnFieldsPublic } from '../users'

export const threadReturnFields = {
  // doc
  _id: v.string(),
  _creationTime: v.number(),
  title: v.optional(v.string()),
  instructions: v.optional(v.string()),
  favourite: v.optional(v.boolean()),
  kvMetadata: v.record(v.string(), v.string()),
  updatedAtTime: v.number(),
  // + fields
  userId: v.id('users'),
  xid: v.optional(v.string()),

  // edge
  user: userReturnFieldsPublic,
}

type ThreadReturnFields = Infer<AsObjectValidator<typeof threadReturnFields>>

export const getThreadEdges = async (ctx: QueryCtx, thread: Ent<'threads'>): Promise<ThreadReturnFields> => {
  return {
    ...thread,
    user: await getUserPublicX(ctx, thread.userId),
    kvMetadata: thread.kvMetadata ?? {},
  }
}
