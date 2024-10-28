import { api } from '@corale/api'
import { useCachedQuery } from './helpers'

export const useChatModels = () => {
  return useCachedQuery(api.entities.chatModels.public.list, {})
}
