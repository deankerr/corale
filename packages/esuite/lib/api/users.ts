import { api } from '@corale/api/convex/_generated/api'
import { useCachedQuery } from './helpers'

export const useViewer = (isViewerId?: string) => {
  const user = useCachedQuery(api.db.users.getViewer, {})
  const isViewer = isViewerId ? isViewerId === user?._id : false
  return { user, isViewer }
}
