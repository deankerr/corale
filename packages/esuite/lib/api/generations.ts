import { api } from '@corale/api/convex/_generated/api'
import type { Id } from '@corale/api/convex/types'
import { useMutation, usePaginatedQuery } from 'convex/react'
import { useCachedQuery } from './helpers'

export const useGenerations = () => {
  return usePaginatedQuery(api.db.generations.list, {}, { initialNumItems: 20 })
}

export const useGeneration = (generationId: Id<'generations_v2'>) => {
  const generation = useCachedQuery(api.db.generations.get, {
    generationId,
  })
  return generation
}

export const useGenerate = () => {
  return useMutation(api.db.generations.create)
}
