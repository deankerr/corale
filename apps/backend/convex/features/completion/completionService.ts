import type { ActionCtx } from '~/_generated/server'
import { createAISDKOpenAIProvider } from './completionProviders/AISDKOpenAI'
import { createOpenAINodeProvider } from './completionProviders/OpenAINode'
import type { CompletionInput } from './types'

const providers = {
  'ai-sdk-openai': createAISDKOpenAIProvider,
  'openai-node': createOpenAINodeProvider,
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

  if (stream && provider?.stream && !input.modelId.startsWith('openai/o1')) {
    return await provider.stream(input)
  }

  return await provider.get(input)
}
