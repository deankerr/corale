import { generateText } from 'ai'
import { internal } from '../../../_generated/api'
import type { ActionCtx } from '../../../_generated/server'
import { createAIProvider } from '../../../lib/ai'
import { parseAIError } from '../../../lib/aiErrors'
import { truncateText } from '../../../lib/parse'
import type { Id } from '../../../types'
import type { RunActivationData } from '../runs'
import { streamAIText } from './streamAIText'

export async function generateAIText(ctx: ActionCtx, { runId }: { runId: Id<'runs'> }) {
  try {
    const run: RunActivationData = await ctx.runMutation(internal.entities.threads.runs.activate, { runId })

    // * run is still queued or has timed out
    if (!run) return

    await new Promise((resolve) => setTimeout(resolve, 5000))

    const { stream, system, messages, modelId, modelParameters, userId } = run

    const ai = createAIProvider({ id: modelId })

    const input = {
      model: ai,
      system,
      messages,
      ...modelParameters,
    }

    console.debug('generateAIText', {
      ...input,
      system: system ? truncateText(system, 200) : undefined,
      messages: messages.map((m) => [m.role, truncateText(m.content, 200)]),
    })

    const result = stream ? await streamAIText(ctx, { runId, userId }, input) : await generateText(input)

    const { text, finishReason, usage, response } = result
    console.debug('generateAIText result', { text, finishReason, usage })

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

    // * fetch openrouter metadata - it can take a moment to become available
    await ctx.scheduler.runAfter(1000, internal.provider.openrouter.generationData.retrieve, {
      runId,
      requestId: response.id,
    })
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
