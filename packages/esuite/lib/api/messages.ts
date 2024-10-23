import { useRoleQueryParam } from '@/lib/searchParams'
import { api } from '@corale/api/convex/_generated/api'
import { usePaginatedQuery } from 'convex/react'
import { useMemo, useRef } from 'react'
import { useCachedQuery } from './helpers'

export const useMessageBySeries = (threadId: string, series: string) => {
  return useCachedQuery(api.db.thread.messages.getBySeries, { threadId, series: parseInt(series) })
}

export const useMessageById = (id: string) => {
  return useCachedQuery(api.db.messages.get, { messageId: id })
}

export const useMessageFeedQuery = (threadId: string, initialNumItems = 25) => {
  const [roleQueryParam] = useRoleQueryParam()

  const messages = usePaginatedQuery(
    api.db.thread.messages.search,
    { threadId, role: roleQueryParam || undefined },
    {
      initialNumItems,
    },
  )
  const results = useMemo(() => messages.results.toReversed(), [messages.results])

  const firstLoadedMessageTime = useRef(0)
  if (!firstLoadedMessageTime.current && results[0]) {
    firstLoadedMessageTime.current = results[0]._creationTime
  }
  const prependedCount = results.filter((message) => message._creationTime < firstLoadedMessageTime.current).length

  if (!threadId || threadId === 'new') {
    if (messages.status === 'LoadingFirstPage') {
      messages.status = 'Exhausted' as any
    }
  }

  return { ...messages, results, prependedCount }
}
