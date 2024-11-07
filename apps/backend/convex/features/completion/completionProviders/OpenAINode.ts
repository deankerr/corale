import type { ActionCtx } from '~/_generated/server'
import type { ModelParameters } from '~/entities/types'
import { ENV } from '~/lib/env'
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
        stream: false,
        model: modelId,
        messages: prependInstructionsMessage(messages, system),
        ...mapParameters(parameters ?? {}),
      }
      console.debug('[openai-node get] input', input)
      console.debug('[openai-node get] last message', input.messages[input.messages.length - 1])

      const result = await openai.chat.completions.create({ ...input, stream: false })

      return mapResult(result)
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

function mapParameters(parameters: ModelParameters) {
  return {
    max_completion_tokens: parameters.maxTokens,
    temperature: parameters.temperature,
    top_p: parameters.topP,
    frequency_penalty: parameters.frequencyPenalty,
    presence_penalty: parameters.presencePenalty,
    stop: parameters.stop,
  }
}

function mapResult(result: OpenAI.Chat.Completions.ChatCompletion): CompletionResult {
  const choice = result.choices[0]
  if (!choice) {
    throw new ConvexError({ message: 'No choice returned from OpenAI', code: 'openai-node-no-choice' })
  }
  console.debug('content', choice.message.content)

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
