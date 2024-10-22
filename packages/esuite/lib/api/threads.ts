import { api } from '@corale/api/convex/_generated/api'
import type { Id } from '@corale/api/convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { parseAsString, useQueryState } from 'nuqs'
import { useEffect, useRef } from 'react'
import { useDebounceValue } from 'usehooks-ts'
import { useCachedQuery } from './helpers'

export const useThreads = () => {
  const threads = useCachedQuery(api.db.threads.list, {})
  if (!threads) return threads

  const favourites = threads.filter((thread) => thread.favourite).sort((a, b) => b.updatedAtTime - a.updatedAtTime)
  const rest = threads.filter((thread) => !thread.favourite).sort((a, b) => b.updatedAtTime - a.updatedAtTime)

  return [...favourites, ...rest]
}

export const useThread = (id: string) => {
  const threads = useThreads()
  const userThread = threads ? (threads?.find((thread) => thread.xid === id) ?? null) : undefined
  const otherThread = useCachedQuery(api.db.threads.get, !userThread ? { id } : 'skip')

  return userThread || otherThread
}

export const useRun = (runId: string | undefined) => {
  return useCachedQuery(api.db.runs.get, runId ? { runId } : 'skip')
}

export const useMessageTextStream = (runId: Id<'runs'> | undefined) => {
  const textStreams = useQuery(api.db.threads.getTextStreams, runId ? { runId } : 'skip')
  return textStreams?.[0]?.content
}

export const useSearchQueryParams = () => {
  return useQueryState('search', parseAsString.withDefault(''))
}

export const useThreadSearch = (threadId: string, textSearchValue: string) => {
  const [debouncedValue, setDebouncedValue] = useDebounceValue(textSearchValue, 300, {
    maxWait: 1000,
  })
  useEffect(() => {
    setDebouncedValue(textSearchValue)
  }, [textSearchValue, setDebouncedValue])

  const text = debouncedValue.length >= 3 ? debouncedValue : ''
  const isSkipped = !text

  // Parse role and name from the search text
  const roleMatch = text.match(/\brole:(\w+)\b/)
  const nameMatch = text.match(/\bname:(\w+)\b/)

  const role = roleMatch ? (roleMatch[1] as 'system' | 'assistant' | 'user') : undefined
  const name = nameMatch ? nameMatch[1] : undefined

  // Validate role to match the literals
  const validRole = role && ['system', 'assistant', 'user'].includes(role) ? role : undefined

  // Remove role: and name: from the search text
  const cleanedText = text.replace(/\b(role|name):\w+\b/g, '').trim()

  // Prepare query arguments
  const queryArgs = {
    threadId,
    text: cleanedText,
    ...(validRole && { role: validRole }),
    ...(name && { name }),
  }

  const results = useQuery(api.db.thread.messages.searchText, text ? queryArgs : 'skip')
  const stored = useRef(results)

  if (results !== undefined) {
    stored.current = results
  }

  const isLoading = results === undefined && !isSkipped

  return {
    results: stored.current ?? [],
    isLoading,
    isSkipped,
  }
}

export const useUpdateThread = () => {
  return useMutation(api.db.threads.update)
}

export const useDeleteThread = () => {
  return useMutation(api.db.threads.remove)
}

export const useUpdateMessage = () => {
  return useMutation(api.db.messages.update)
}

export const useDeleteMessage = () => {
  return useMutation(api.db.messages.remove)
}
