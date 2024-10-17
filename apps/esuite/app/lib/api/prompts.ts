import { useCachedQuery } from '@/app/lib/api/helpers'
import { api } from '@corale/api/convex/_generated/api'

export const usePrompts = () => {
  const prompts = useCachedQuery(api.db.texts.listPrompts, {})
  return prompts ? prompts.sort((a, b) => b.updatedAt - a.updatedAt) : prompts
}

export const usePrompt = (promptId: string) => {
  const prompts = usePrompts()
  const prompt = prompts ? (prompts.find((prompt) => prompt._id === promptId) ?? null) : undefined

  return prompt
}
