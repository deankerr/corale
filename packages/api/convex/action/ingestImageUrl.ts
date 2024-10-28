import { pick } from 'convex-helpers'
import { v } from 'convex/values'
import { nanoid } from 'nanoid/non-secure'
import { internal } from '../_generated/api'
import { ImageSchemaFields } from '../entities/images/validators'
import { internalAction } from '../functions'

export const run = internalAction({
  args: {
    ...pick(ImageSchemaFields, ['sourceUrl', 'sourceType', 'generationId', 'ownerId']),
    runId: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<void> => {
    const runId = args.runId ?? nanoid()
    const { fileId, metadata } = await ctx.runAction(internal.lib.sharp.storeImageFromUrl, {
      url: args.sourceUrl,
    })

    await ctx.runMutation(internal.entities.images.action.create, {
      ...args,
      fileId,
      runId,
      ...metadata,
    })
  },
})
