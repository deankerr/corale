import { generateText } from 'ai'
import { internal } from '../../../_generated/api'
import type { ActionCtx } from '../../../_generated/server'
import { createAIProvider } from '../../../lib/ai'
import { getErrorMessage } from '../../../lib/utils'
import type { Id } from '../../../types'
import type { RunActivationData } from '../runs'
import { streamAIText } from './streamAIText'

export async function generateAIText(ctx: ActionCtx, { runId }: { runId: Id<'runs'> }) {
  try {
    const { stream, system, messages, modelId, modelParameters, userId }: RunActivationData = await ctx.runMutation(
      internal.entities.threads.runs.activate,
      { runId },
    )

    const ai = createAIProvider({ id: modelId })

    const input = {
      model: ai,
      system,
      messages,
      ...modelParameters,
    }

    const result = stream ? await streamAIText(ctx, { runId, userId }, input) : await generateText(input)

    const { text, finishReason, usage, response } = result

    // * complete run and update message
    await ctx.runMutation(internal.entities.threads.runs.complete, {
      runId,
      text,
      finishReason,
      usage,
      modelId: response.modelId,
      requestId: response.id,
      firstTokenAt: 'firstTokenAt' in result ? result.firstTokenAt : undefined,
    })

    // * fetch openrouter metadata
    await ctx.scheduler.runAfter(500, internal.provider.openrouter.generationData.retrieve, {
      runId,
      requestId: response.id,
    })
  } catch (err) {
    console.error(err)
    await ctx.runMutation(internal.entities.threads.runs.fail, {
      runId,
      errors: [{ message: getErrorMessage(err), code: 'unknown' }],
    })
  }
}
