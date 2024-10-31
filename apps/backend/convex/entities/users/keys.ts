import { internalMutation, mutation } from '../../functions'
import { generateRandomString } from '../../lib/utils'
import type { Id, MutationCtx } from '../../types'
import { v } from '../../values'

async function refreshApiKey(ctx: MutationCtx, userId: Id<'users'>) {
  // invalidate all current keys
  await ctx
    .table('users_api_keys', 'userId', (q) => q.eq('userId', userId))
    .map(async (apiKey) => {
      if (apiKey.valid) await apiKey.patch({ valid: false })
    })

  const secret = `sk_${generateRandomString(32)}`
  const id = await ctx.table('users_api_keys').insert({ secret, valid: true, userId })
  console.info('api key created', id, secret)
  return { id, secret }
}

export const generateApiKeyForUser = internalMutation({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => await refreshApiKey(ctx, userId),
})

export const generateViewerApiKey = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.viewerX()
    return await refreshApiKey(ctx, user._id)
  },
})
