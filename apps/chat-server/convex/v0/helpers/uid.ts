import type { QueryCtx } from '#common'
import { customAlphabet } from 'nanoid'

function createUid() {
  return customAlphabet('abdefhijklmnopqrtuvwxyz0123456789', 12)()
}

export const generateUid = {
  trees: async (ctx: QueryCtx): Promise<string> => {
    const uid = createUid()
    const exists = await ctx.db
      .query('trees')
      .withIndex('by_uid', (q) => q.eq('uid', uid))
      .first()
    return exists ? generateUid.trees(ctx) : uid
  },

  nodes: async (ctx: QueryCtx): Promise<string> => {
    const uid = createUid()
    const exists = await ctx.db
      .query('nodes')
      .withIndex('by_uid', (q) => q.eq('uid', uid))
      .first()
    return exists ? generateUid.trees(ctx) : uid
  },
}
