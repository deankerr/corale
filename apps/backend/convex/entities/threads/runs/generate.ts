import { internal } from '~/_generated/api'
import type { ActionCtx } from '~/_generated/server'
import { runsCompletionProviderId } from '~/constants'
import { generateCompletion } from '~/features/completion/completionService'
import { parseAIError } from '~/lib/aiErrors'
import type { Id } from '~/types'
import { ms } from 'itty-time'
import type { RunActivationData } from '../runs'

export async function generateCompletionText(ctx: ActionCtx, { runId }: { runId: Id<'runs'> }) {
  try {
    const run: RunActivationData = await ctx.runMutation(internal.entities.threads.runs.activate, { runId })
    // * run is still queued or has timed out
    if (!run) return

    const { stream, system, messages, modelId, modelParameters, userId } = run

    const textId = stream
      ? await ctx.runMutation(internal.entities.texts.internal.createMessageText, {
          runId,
          userId,
        })
      : undefined

    const { text, finishReason, usage, response, firstTokenAt } = await generateCompletion(ctx, {
      completionProviderId: runsCompletionProviderId,
      stream,
      input: { system, messages, modelId, parameters: modelParameters, textId },
    })

    // * complete run and update message
    await ctx.runMutation(internal.entities.threads.runs.complete, {
      runId,
      text,
      finishReason,
      usage,
      modelId: response.modelId,
      requestId: response.id,
      firstTokenAt,
    })

    // * post run cleanup

    if (textId) {
      // * schedule text deletion - frontend will still need it until the result has been added
      // * to the response message, to avoid it flashing in and out
      try {
        await ctx.scheduler.runAfter(ms('1 minute'), internal.entities.texts.internal.deleteText, {
          textId,
        })
      } catch (err) {
        console.error(err)
      }
    }

    try {
      // * fetch openrouter metadata - it can take a moment to become available
      await ctx.scheduler.runAfter(1000, internal.provider.openrouter.generationData.retrieve, {
        runId,
        requestId: response.id,
      })
    } catch (err) {
      console.error(err)
    }
  } catch (err) {
    console.error('AI Generation Error:', err)
    const structuredError = parseAIError(err)

    await ctx.runMutation(internal.entities.threads.runs.fail, {
      runId,
      errors: [
        {
          message: structuredError.message,
          code: structuredError.code,
          data: structuredError.details,
        },
      ],
    })
  }
}
