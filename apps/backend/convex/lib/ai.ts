import { createOpenAI, openai } from '@ai-sdk/openai'
import { ENV } from '../lib/env'

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
