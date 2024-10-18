import { pick } from 'convex-helpers'
import { v } from 'convex/values'
import { nanoid } from 'nanoid/non-secure'
import { internal } from '../_generated/api'
import { internalAction } from '../functions'
import { imagesV2Fields } from '../schema'

export const run = internalAction({
  args: {
    ...pick(imagesV2Fields, ['sourceUrl', 'sourceType', 'generationId', 'ownerId']),
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
