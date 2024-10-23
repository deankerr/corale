import { pick } from 'convex-helpers'
import { v } from 'convex/values'
import { nanoid } from 'nanoid/non-secure'
import { internal } from '../_generated/api'
import { imageSchemaFields } from '../entities/images'
import { internalAction } from '../functions'

export const run = internalAction({
  args: {
    ...pick(imageSchemaFields, ['sourceUrl', 'sourceType', 'generationId', 'ownerId']),
    runId: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<void> => {
    const runId = args.runId ?? nanoid()
    const { fileId, metadata } = await ctx.runAction(internal.lib.sharp.storeImageFromUrl, {
      url: args.sourceUrl,
    })

    await ctx.runMutation(internal.db.images.createImageV2, {
      ...args,
      fileId,
      runId,
      ...metadata,
    })
  },
})
