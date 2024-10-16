import { createOpenAI, openai } from '@ai-sdk/openai'
import { ConvexError } from 'convex/values'
import * as vb from 'valibot'

import { ENV } from '../lib/env'
import { ResourceKey } from '../lib/valibot'

export function createAIProvider(model: { id: string; provider?: string }) {
  switch (model.provider) {
    case 'openai':
      return openai(model.id)
    default:
      return createOpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: ENV.OPENROUTER_API_KEY,
        headers: {
          'HTTP-Referer': `https://${ENV.APP_HOSTNAME}`,
          'X-Title': `esuite`,
        },
        compatibility: 'strict',
      })(model.id)
  }
}

// TODO * remove:

const createProvider = (endpoint: string) => {
  switch (endpoint) {
    case 'openai':
      return openai

    case 'openrouter':
      return createOpenAI({
        apiKey: ENV.OPENROUTER_API_KEY,
        baseURL: 'https://openrouter.ai/api/v1',
      })
  }

  throw new ConvexError(`invalid endpoint: ${endpoint}`)
}

export const createAi = (resourceKey: string) => {
  const { endpoint, modelId } = vb.parse(ResourceKey, resourceKey)

  const provider = createProvider(endpoint)

  return {
    model: provider(modelId),
    provider,
  }
}
