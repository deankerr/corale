import { updateKvMetadata } from '~/entities/kvMetadata'
import { ensureThreadHasTitle } from '~/entities/threads/actions'
import { internalMutation } from '~/functions'
import { v } from '~/values'
import { ConvexError } from 'convex/values'
import { RunSchemaFields } from '../schema'

// * complete run - update message with final result, update run with usage stats/timings
export const complete = internalMutation({
  args: {
    runId: v.id('runs'),
    text: v.string(),
    finishReason: v.string(),
    usage: v.object({
      promptTokens: v.number(),
      completionTokens: v.number(),
      totalTokens: v.number(),
    }),
    modelId: v.string(),
    requestId: v.string(),
    firstTokenAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const run = await ctx.skipRules.table('runs').getX(args.runId)
    if (run.status !== 'active') {
      throw new ConvexError({ message: 'run is not active', runId: args.runId })
    }

    const message = await ctx.skipRules.table('messages').getX('runId', run._id)

    // Update message
    const kvMetadata = updateKvMetadata(message.kvMetadata ?? {}, {
      delete: ['esuite:run:active'],
      set: {
        'esuite:model:id': args.modelId,
      },
    })
    await message.patch({ text: args.text, kvMetadata })

    // Update run
    await run.patch({
      status: 'done',
      updatedAt: Date.now(),
      timings: {
        ...run.timings,
        endedAt: Date.now(),
        firstTokenAt: args.firstTokenAt,
      },
      usage: {
        finishReason: args.finishReason,
        promptTokens: args.usage.promptTokens,
        completionTokens: args.usage.completionTokens,
        modelId: args.modelId,
        requestId: args.requestId,
      },
      results: [
        {
          type: 'message',
          id: message._id,
        },
      ],
    })

    try {
      await ensureThreadHasTitle(ctx, run.threadId)
    } catch (err) {
      console.error(err)
    }
  },
  returns: v.null(),
})

// * update post run provider usage data
export const updateProviderMetadata = internalMutation({
  args: {
    runId: v.id('runs'),
    usage: RunSchemaFields.usage,
    providerMetadata: v.record(v.string(), v.any()),
  },
  handler: async (ctx, { runId, usage, providerMetadata }) => {
    const run = await ctx.skipRules.table('runs').getX(runId)
    await run.patch({
      usage: usage ?? run.usage,
      providerMetadata,
    })
  },
  returns: v.null(),
})
