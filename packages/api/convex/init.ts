import { internal } from './_generated/api'
import { internalAction, internalMutation } from './functions'
import { nullable, v } from './values'

const init = internalAction({
  args: {
    deleteAllFiles: v.optional(v.boolean()),
  },
  handler: async (ctx, { deleteAllFiles = false }) => {
    if (deleteAllFiles) await ctx.runAction(internal.init.dev_deleteAllFiles, {})
    await ctx.runAction(internal.lib.clerk.importUsers, {})
    await ctx.runAction(internal.provider.openrouter.updateOpenRouterModels, {})
  },
})

export default init

export const dev_iterateBatchDelete = internalMutation({
  args: {
    cursor: nullable(v.string()),
    numItems: v.number(),
  },
  handler: async (ctx, { cursor, numItems }) => {
    if (process.env.CONVEX_ENVIRONMENT !== 'development') throw new Error('CONVEX_ENVIRONMENT is not development')

    const { page, isDone, continueCursor } = await ctx.table.system('_storage').paginate({ cursor, numItems })
    for (const file of page) {
      await ctx.storage.delete(file._id)
    }

    return { cursor: continueCursor, isDone }
  },
})

export const dev_deleteAllFiles = internalAction({
  args: {
    cursor: v.optional(nullable(v.string())),
    batchSize: v.optional(v.number()),
  },
  handler: async (ctx, { cursor = null, batchSize = 100 }) => {
    if (process.env.CONVEX_ENVIRONMENT !== 'development') throw new Error('CONVEX_ENVIRONMENT is not development')

    let isDone = false
    while (!isDone) {
      const args = { cursor, numItems: batchSize }
      const result = await ctx.runMutation(internal.init.dev_iterateBatchDelete, args)
      cursor = result.cursor
      isDone = result.isDone
    }
  },
})
