import { api } from '@corale/backend'
import { useCachedQuery } from './helpers'

export const useChatModels = () => {
  return useCachedQuery(api.entities.chatModels.public.list, {})
}

export const useChatModel = (modelId: string) => {
  const models = useChatModels()
  return models?.find((model) => model.modelId === modelId)
}
