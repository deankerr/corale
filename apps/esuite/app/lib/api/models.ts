import { api } from '@corale/api/convex/_generated/api'
import { useCachedQuery } from '@corale/esuite/app/lib/api/helpers'

export const useChatModels = () => {
  return useCachedQuery(api.db.models.listChatModels, {})
}
