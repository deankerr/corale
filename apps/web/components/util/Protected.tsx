'use client'

import { useCachedQuery } from '@/lib/api/helpers'
import { api, type Id } from '@corale/backend'

export const Protected = ({ children, isUser }: { children: React.ReactNode; isUser: Id<'users'> }) => {
  const user = useCachedQuery(api.entities.users.public.getViewer, {})

  if (user?._id !== isUser) return null
  return children
}
