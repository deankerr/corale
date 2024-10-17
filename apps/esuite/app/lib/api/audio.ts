import { useCachedQuery } from '@/app/lib/api/helpers'
import { api } from '@corale/api/convex/_generated/api'
import type { Id } from '@corale/api/convex/types'

export const useAudio = (audioId: string) => {
  return useCachedQuery(api.db.audio.get, { audioId: audioId as Id<'audio'> })
}
