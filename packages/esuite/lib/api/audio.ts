import { api } from '@corale/api/convex/_generated/api'
import { useCachedQuery } from './helpers'

export const useAudio = (audioId: string) => {
  return useCachedQuery(api.db.audio.get, { audioId })
}
