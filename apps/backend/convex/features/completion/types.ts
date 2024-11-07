import type { ModelParameters } from '~/entities/types'
import type { Id } from '~/types'

export interface CompletionProvider {
  id: string
  get: (input: CompletionInput) => Promise<CompletionResult>
  stream?: (input: CompletionInput) => Promise<CompletionResult>
}

export type CompletionInput = {
  system?: string
  modelId: string
  messages: { role: 'user' | 'system' | 'assistant'; content: string }[]
  parameters?: ModelParameters
  textId?: Id<'texts'>
}

export type CompletionResult = {
  text: string
  finishReason: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  response: {
    id: string
    modelId: string
  }
  firstTokenAt?: number
}
