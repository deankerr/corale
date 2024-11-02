import { ConvexError, v } from 'convex/values'
import { z } from 'zod'
import { internal } from '../../_generated/api'
import { internalAction } from '../../functions'
import { ENV } from '../../lib/env'

const MAX_ATTEMPTS = 5

const OpenRouterMetadata = z.object({
  id: z.string(),
  model: z.string(),
  total_cost: z.number(),
  finish_reason: z.string(),
  native_tokens_prompt: z.number(),
  native_tokens_completion: z.number(),
})

async function fetchOpenRouterMetadata(requestId: string) {
  try {
    const response = await fetch(`https://openrouter.ai/api/v1/generation?id=${requestId}`, {
      headers: {
        Authorization: `Bearer ${ENV.OPENROUTER_API_KEY}`,
      },
    })
    const json = await response.json()

    if ('data' in json) return json.data
    console.error(json)
    return null
  } catch (err) {
    console.error(err)
    return null
  }
}

export const retrieve = internalAction({
  args: {
    runId: v.id('runs'),
    requestId: v.string(),
    attempts: v.optional(v.number()),
  },
  handler: async (ctx, { runId, requestId, attempts = 1 }) => {
    try {
      const providerMetadata = await fetchOpenRouterMetadata(requestId)
      if (!providerMetadata) throw new ConvexError('failed to fetch openrouter metadata')

      const parsed = OpenRouterMetadata.parse(providerMetadata)

      await ctx.runMutation(internal.entities.threads.runs.updateProviderMetadata, {
        runId,
        usage: {
          cost: parsed.total_cost,
          finishReason: parsed.finish_reason,
          promptTokens: parsed.native_tokens_prompt,
          completionTokens: parsed.native_tokens_completion,
          modelId: parsed.model,
          requestId: parsed.id,
        },
        providerMetadata,
      })
    } catch (err) {
      if (attempts >= MAX_ATTEMPTS) throw err

      await ctx.scheduler.runAfter(2000 * attempts, internal.provider.openrouter.generationData.retrieve, {
        runId,
        requestId,
        attempts: attempts + 1,
      })
    }
  },
})
