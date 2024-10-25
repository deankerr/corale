import { api } from '@corale/api/convex/_generated/api'
import { usePaginatedQuery } from 'convex/react'
import { useCachedQuery } from './helpers'

export const useAudio = (audioId: string) => {
  return useCachedQuery(api.entities.audio.get, { audioId })
}

export const useMyAudioList = (initialNumItems = 25) => {
  return usePaginatedQuery(api.entities.audio.listMy, {}, { initialNumItems })
}
