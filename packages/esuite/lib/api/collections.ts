import { api } from '@corale/api/convex/_generated/api'
import { usePaginatedQuery } from 'convex/react'
import { useCachedQuery } from './helpers'

export const useCollections = () => {
  const collections = useCachedQuery(api.db.collections.latest, {})
  return collections
}

export const useCollection = (collectionId: string) => {
  const collections = useCachedQuery(api.db.collections.latest, {})
  const userCollection = collections?.find((c) => c.id === collectionId) ?? null
  const nonUserCollection = useCachedQuery(api.db.collections.get, !userCollection ? { collectionId } : 'skip')
  return userCollection || nonUserCollection
}

export const useCollectionImages = (collectionId?: string, order?: 'asc' | 'desc') => {
  const images = usePaginatedQuery(api.db.collections.listImages, collectionId ? { collectionId, order } : 'skip', {
    initialNumItems: 24,
  })
  return collectionId ? images : undefined
}
