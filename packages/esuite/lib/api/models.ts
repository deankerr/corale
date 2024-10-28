import { api } from '@corale/api/convex/_generated/api'
import { useCachedQuery } from './helpers'

export const useChatModels = () => {
  return useCachedQuery(api.entities.chatModels.public.list, {})
}
