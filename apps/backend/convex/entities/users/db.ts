import type { Id, QueryCtx } from '../../types'
import { ConvexError, omit } from '../../values'

export const getUser = async (ctx: QueryCtx, userId: Id<'users'>) => {
  const user = await ctx.table('users').get(userId)
  if (!user) return null

  return {
    ...omit(user.doc(), ['tokenIdentifier']),
  }
}

export const getUserX = async (ctx: QueryCtx, userId: Id<'users'>) => {
  const user = await getUser(ctx, userId)
  if (!user || user.deletionTime) throw new ConvexError({ message: 'invalid user id', xid: userId })
  return user
}
