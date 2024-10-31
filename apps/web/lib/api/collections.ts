import { api } from '@corale/backend'
import { usePaginatedQuery } from 'convex/react'
import { useCachedQuery } from './helpers'

export const useCollections = (enabled: boolean = true) => {
  const collections = useCachedQuery(api.entities.collections.public.latest, enabled ? {} : 'skip')
  return collections
}

export const useCollection = (collectionId: string) => {
  const collections = useCachedQuery(api.entities.collections.public.latest, {})
  const userCollection = collections?.find((c) => c.xid === collectionId) ?? null
  const nonUserCollection = useCachedQuery(
    api.entities.collections.public.get,
    !userCollection ? { collectionId } : 'skip',
  )
  return userCollection || nonUserCollection
}

export const useCollectionImages = (collectionId?: string, order?: 'asc' | 'desc') => {
  const images = usePaginatedQuery(
    api.entities.collections.public.listImages,
    collectionId ? { collectionId, order } : 'skip',
    {
      initialNumItems: 24,
    },
  )
  return collectionId ? images : undefined
}
