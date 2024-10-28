import { api } from '@corale/api/convex/_generated/api'
import { useMutation, usePaginatedQuery } from 'convex/react'

export const useMyImagesList = (order?: 'asc' | 'desc') => {
  const images = usePaginatedQuery(api.entities.images.public.listMy, { order }, { initialNumItems: 24 })
  return images
}

export const useDeleteImage = () => {
  return useMutation(api.entities.images.public.remove)
}
