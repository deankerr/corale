import { api } from '@corale/api/convex/_generated/api'
import type { Id } from '@corale/api/convex/types'
import { useMutation, usePaginatedQuery } from 'convex/react'
import { useCachedQuery } from './helpers'

export const useGenerations = () => {
  return usePaginatedQuery(api.entities.generations.public.list, {}, { initialNumItems: 20 })
}

export const useGeneration = (generationId: Id<'generations_v2'>) => {
  const generation = useCachedQuery(api.entities.generations.public.get, {
    generationId,
  })
  return generation
}

export const useGenerate = () => {
  return useMutation(api.entities.generations.public.create)
}
