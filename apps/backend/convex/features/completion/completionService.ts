import type { ActionCtx } from '~/_generated/server'
import { createAISDKOpenAIProvider } from './completionProviders/AISDKOpenAI'
import type { CompletionInput } from './types'

const providers = {
  'ai-sdk-openai': createAISDKOpenAIProvider,
} as const

export async function generateCompletion(
  ctx: ActionCtx,
  {
    completionProviderId,
    stream,
    input,
  }: { completionProviderId: keyof typeof providers; stream: boolean; input: CompletionInput },
) {
  const provider = providers[completionProviderId](ctx)

  if (stream && provider?.stream) {
    return provider.stream(input)
  }

  return provider.get(input)
}
