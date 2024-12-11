import { updateKvMetadata } from '~/entities/kvMetadata'
import { internalMutation } from '~/functions'
import { v } from '~/values'
import { ConvexError } from 'convex/values'

// * fail run - update run with error messages, timings
export const fail = internalMutation({
  args: {
    runId: v.id('runs'),
    errors: v.array(
      v.object({
        code: v.string(),
        message: v.string(),
        data: v.optional(v.any()),
      }),
    ),
  },
  handler: async (ctx, { runId, errors }) => {
    const run = await ctx.skipRules.table('runs').getX(runId)
    if (run.status !== 'active') {
      throw new ConvexError({ message: 'run is not active', runId })
    }

    // Update run
    await run.patch({
      status: 'failed',
      updatedAt: Date.now(),
      timings: {
        ...run.timings,
        endedAt: Date.now(),
      },
      errors: [...(run.errors ?? []), ...errors],
    })

    // Update message with error
    const message = await ctx.skipRules.table('messages').get('runId', run._id)

    if (message) {
      const kvMetadata = updateKvMetadata(message.kvMetadata ?? {}, {
        delete: ['esuite:run:active'],
        set: {
          'esuite:run:error': errors.at(-1)?.message ?? 'Unknown error',
        },
      })
      await message.patch({ kvMetadata })
    }
  },
  returns: v.null(),
})
