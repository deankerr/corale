import { createOpenAI } from '@ai-sdk/openai'
import { internal } from '~/_generated/api'
import type { ActionCtx } from '~/_generated/server'
import { ENV } from '~/lib/env'
import { hasDelimiter } from '~/lib/parse'
import { generateText, streamText } from 'ai'
import type { CompletionProvider, CompletionResult } from '../types'

export function createAISDKOpenAIProvider(ctx: ActionCtx): CompletionProvider {
  const provider = createOpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: ENV.OPENROUTER_API_KEY,
    headers: {
      'HTTP-Referer': `https://${ENV.APP_HOSTNAME}`,
      'X-Title': `esuite`,
    },
    compatibility: 'compatible',
  })

  return {
    id: 'ai-sdk-openai',

    get: async ({ system, modelId, messages, parameters }) => {
      const result = await generateText({
        model: provider(modelId),
        system,
        messages,
        ...parameters,
      })

      return await mapAISDKResult(result)
    },

    stream: async ({ system, modelId, messages, parameters, textId }) => {
      if (!textId) console.warn('No textId provided for stream, incremental results will not be available')

      const result = await streamText({
        model: provider(modelId),
        system,
        messages,
        ...parameters,
      })

      let firstTokenAt = 0
      let totalText = ''
      for await (const textPart of result.textStream) {
        if (!textPart) continue
        if (!firstTokenAt) firstTokenAt = Date.now()
        totalText += textPart
        if (textId && (hasDelimiter(textPart) || textPart.length > 200)) {
          await ctx.runMutation(internal.entities.texts.internal.streamToText, {
            textId,
            content: totalText,
          })
        }
      }

      return await mapAISDKResult(result)
    },
  }
}

async function mapAISDKResult(
  result: Awaited<ReturnType<typeof generateText>> | Awaited<ReturnType<typeof streamText>>,
): Promise<CompletionResult> {
  return {
    text: await result.text,
    finishReason: await result.finishReason,
    usage: await result.usage,
    response: await result.response,
  }
}
