import { generateText, streamText } from 'ai'
import { ConvexError, v } from 'convex/values'
import { internal } from '../_generated/api'
import type { Id } from '../_generated/dataModel'
import type { ActionCtx } from '../_generated/server'
import { internalAction } from '../functions'
import { createAIProvider } from '../lib/ai'
import { ENV } from '../lib/env'
import { getErrorMessage, hasDelimiter } from '../lib/utils'

export const run = internalAction({
  args: {
    runId: v.id('runs'),
  },

  handler: async (ctx, { runId }) => {
    try {
      const {
        stream,
        instructions = '',
        additionalInstructions = '',
        messages,
        model: { id: modelId, provider: modelProvider, ...modelParameters },
        userId,
        messageId,
        patternId,
        options,
      } = await ctx.runMutation(internal.db.runs.activate, {
        runId,
      })

      const system = [instructions, additionalInstructions].join('\n\n').trim() || undefined

      const parameters = { ...modelParameters, maxTokens: options?.maxCompletionTokens }

      console.log({
        stream,
        patternId,
        modelId,
        parameters,
        system: system?.slice(0, 500),
        messages: messages.map((message) => ({
          ...message,
          content: message.content.slice(0, 500),
        })),
      })

      const model = createAIProvider({ id: modelId })

      const input = {
        ...parameters,
        model,
        system,
        messages,
      }

      const { text, finishReason, usage, warnings, response, firstTokenAt } = stream
        ? await streamAIText(ctx, { runId, userId }, input)
        : await getAIText(input)

      console.log(text, { finishReason, usage, warnings })

      await ctx.runMutation(internal.db.runs.complete, {
        runId,
        messageId,
        text,
        firstTokenAt,
        finishReason,
        promptTokens: usage.promptTokens,
        completionTokens: usage.completionTokens,
        modelId: response.modelId,
        requestId: response.id,
      })

      // * get openrouter metadata
      await ctx.scheduler.runAfter(500, internal.action.run.getProviderMetadata, {
        runId,
        requestId: response.id,
      })
    } catch (err) {
      console.error(err)

      await ctx.runMutation(internal.db.runs.fail, {
        runId,
        errors: [{ message: getErrorMessage(err), code: 'unknown' }],
      })
    }
  },
})

async function getAIText(input: Parameters<typeof generateText>[0]) {
  const { text, finishReason, usage, warnings, response } = await generateText(input)
  return { text, finishReason, usage, warnings, response, firstTokenAt: undefined }
}

async function streamAIText(
  ctx: ActionCtx,
  run: { runId: Id<'runs'>; userId: Id<'users'> },
  input: Parameters<typeof streamText>[0],
) {
  const textId = await ctx.runMutation(internal.entities.texts.action.createMessageText, {
    runId: run.runId,
    userId: run.userId,
  })
  const result = await streamText(input)

  let firstTokenAt = 0
  let streamedText = ''
  for await (const textPart of result.textStream) {
    if (!textPart) continue
    if (!firstTokenAt) firstTokenAt = Date.now()
    streamedText += textPart
    if (hasDelimiter(textPart)) {
      await ctx.runMutation(internal.entities.texts.action.streamToText, {
        textId,
        content: streamedText,
      })
    }
  }

  const [text, finishReason, usage, warnings, response] = await Promise.all([
    result.text,
    result.finishReason,
    result.usage,
    result.warnings,
    result.response,
  ])

  try {
    await ctx.scheduler.runAfter(0, internal.entities.texts.action.deleteText, {
      textId,
    })
  } catch (err) {
    console.error(err)
  }

  return { text, finishReason, usage, warnings, response, firstTokenAt }
}

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

const MAX_ATTEMPTS = 5
export const getProviderMetadata = internalAction({
  args: {
    runId: v.id('runs'),
    requestId: v.string(),
    attempts: v.optional(v.number()),
  },
  handler: async (ctx, { runId, requestId, attempts = 1 }) => {
    try {
      const metadata = await fetchOpenRouterMetadata(requestId)
      if (!metadata) throw new ConvexError('failed to fetch openrouter metadata')

      await ctx.runMutation(internal.db.runs.updateProviderMetadata, {
        runId,
        providerMetadata: metadata,
      })
    } catch (err) {
      if (attempts >= MAX_ATTEMPTS) throw new ConvexError('failed to fetch openrouter metadata')

      await ctx.scheduler.runAfter(2000 * attempts, internal.action.run.getProviderMetadata, {
        runId,
        requestId,
        attempts: attempts + 1,
      })
    }
  },
})
