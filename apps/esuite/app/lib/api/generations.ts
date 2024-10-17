import { api } from '@corale/api/convex/_generated/api'
import { useCachedQuery } from '@corale/esuite/app/lib/api/helpers'
import { useMutation, usePaginatedQuery } from 'convex/react'

import type { Id } from '@corale/api/convex/types'

export const useGenerations = () => {
  const generations = usePaginatedQuery(api.db.generations.list, {}, { initialNumItems: 20 })
  return generations
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
