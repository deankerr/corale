import { internal } from '~/_generated/api'
import type { ActionCtx } from '~/_generated/server'
import type { ModelParameters } from '~/entities/types'
import { ENV } from '~/lib/env'
import { hasDelimiter } from '~/lib/parse'
import { ConvexError } from 'convex/values'
import OpenAI from 'openai'
import type { CompletionInput, CompletionProvider, CompletionResult } from '../types'

export function createOpenAINodeProvider(ctx: ActionCtx): CompletionProvider {
  const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: ENV.OPENROUTER_API_KEY,
    defaultHeaders: {
      'HTTP-Referer': `https://${ENV.APP_HOSTNAME}`,
      'X-Title': `esuite`,
    },
  })

  return {
    id: 'openai-node',

    get: async ({ system, modelId, messages, parameters }) => {
      const input = {
        model: modelId,
        messages: prependInstructionsMessage(messages, system),
        ...mapParameters(parameters ?? {}),
      }
      console.debug('[openai-node.get] input', input)

      const result = await openai.chat.completions.create({ ...input, stream: false })

      return mapResult(result)
    },

    stream: async ({ system, modelId, messages, parameters, textId }) => {
      if (!textId) console.warn('No textId provided for stream, incremental results will not be available')

      const input = {
        model: modelId,
        messages: prependInstructionsMessage(messages, system),
        ...mapParameters(parameters ?? {}),
      }
      console.debug('[openai-node.stream] input', input)

      const result = await openai.chat.completions.create({
        ...input,
        stream: true,
        stream_options: { include_usage: true },
      })

      let firstTokenAt = 0
      let totalText = ''
      let finishReason: string | null = null
      let usage: OpenAI.Chat.Completions.ChatCompletionChunk['usage'] = null
      let id: OpenAI.Chat.Completions.ChatCompletionChunk['id'] | null = null
      let model: OpenAI.Chat.Completions.ChatCompletionChunk['model'] | null = null

      for await (const chunk of result) {
        if (chunk.choices[0]?.finish_reason) finishReason = chunk.choices[0].finish_reason
        if (chunk.usage) usage = chunk.usage
        if (chunk.id) id = chunk.id
        if (chunk.model) model = chunk.model

        const text = chunk.choices[0]?.delta.content
        if (!text) continue
        if (!firstTokenAt) firstTokenAt = Date.now()
        totalText += text
        if (textId && (hasDelimiter(text) || text.length > 200)) {
          await ctx.runMutation(internal.entities.texts.internal.streamToText, {
            textId,
            content: totalText,
          })
        }
      }

      return {
        text: totalText,
        finishReason: finishReason ?? 'unknown',
        usage: {
          promptTokens: usage?.prompt_tokens ?? 0,
          completionTokens: usage?.completion_tokens ?? 0,
          totalTokens: usage?.total_tokens ?? 0,
        },
        response: {
          id: id ?? 'unknown',
          modelId: model ?? 'unknown',
        },
      }
    },
  }
}

function prependInstructionsMessage(
  messages: CompletionInput['messages'],
  system?: CompletionInput['system'],
): CompletionInput['messages'] {
  if (!system) return messages
  return [{ role: 'system', content: system }, ...messages]
}

type OpenAIParameters = Pick<
  OpenAI.Chat.ChatCompletionCreateParams,
  'max_completion_tokens' | 'temperature' | 'top_p' | 'frequency_penalty' | 'presence_penalty' | 'stop'
>

function mapParameters(parameters: ModelParameters): OpenAIParameters {
  return {
    max_completion_tokens: parameters.maxTokens,
    temperature: parameters.temperature,
    top_p: parameters.topP,
    frequency_penalty: parameters.frequencyPenalty,
    presence_penalty: parameters.presencePenalty,
    stop: parameters.stop,
    // @ts-expect-error supported by OpenRouter but not OpenAI
    top_k: parameters.topK,
    repetition_penalty: parameters.repetitionPenalty,
  }
}

function mapResult(result: OpenAI.Chat.Completions.ChatCompletion): CompletionResult {
  const choice = result.choices[0]
  if (!choice) {
    throw new ConvexError({ message: 'No choice returned from OpenAI', code: 'openai-node-no-choice' })
  }

  return {
    text: choice.message.content ?? '',
    finishReason: choice.finish_reason,
    usage: {
      promptTokens: result.usage?.prompt_tokens ?? 0,
      completionTokens: result.usage?.completion_tokens ?? 0,
      totalTokens: result.usage?.total_tokens ?? 0,
    },
    response: {
      id: result.id,
      modelId: result.model,
    },
  }
}
