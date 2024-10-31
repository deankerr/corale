import { api } from '@corale/backend'
import { useCachedQuery } from './helpers'

export const usePrompts = () => {
  const prompts = useCachedQuery(api.entities.texts.public.listMyPrompts, {})
  return prompts ? prompts.sort((a, b) => b.updatedAt - a.updatedAt) : prompts
}

export const usePrompt = (promptId: string) => {
  const prompts = usePrompts()
  const prompt = prompts ? (prompts.find((prompt) => prompt._id === promptId) ?? null) : undefined

  return prompt
}
