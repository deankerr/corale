import { api } from '@corale/api/convex/_generated/api'
import { useCachedQuery } from '@corale/esuite/app/lib/api/helpers'

import type { Id } from '@corale/api/convex/types'

export const useAudio = (audioId: string) => {
  return useCachedQuery(api.db.audio.get, { audioId: audioId as Id<'audio'> })
}
