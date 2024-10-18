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

export const useThread = (threadId: string) => {
  const threads = useThreads()
  const userThread = threads ? (threads?.find((thread) => thread.xid === threadId) ?? null) : undefined
  const otherThread = useCachedQuery(api.db.threads.get, !userThread ? { slugOrId: threadId } : 'skip')

  return userThread || otherThread
}

export const useRun = (runId: string | undefined) => {
  return useCachedQuery(api.db.runs.get, runId ? { runId } : 'skip')
}

// export const useListThreadRuns = (threadId: string) => {
//   return useQuery(api.db.thread.runs.list, { threadId })
// }

export const useMessageTextStream = (runId: Id<'runs'> | undefined) => {
  const textStreams = useQuery(api.db.threads.getTextStreams, runId ? { runId } : 'skip')
  return textStreams?.[0]?.content
}

export const useThreadTextSearchQueryParams = () => {
  const search = useQueryState('search', parseAsString.withDefault(''))
  const name = useQueryState('name', parseAsString.withDefault(''))
  return { search, name }
}

export const useThreadTextSearch = (args: { threadId: string; name?: string }, textSearchValue: string) => {
  const [debouncedValue, setDebouncedValue] = useDebounceValue(textSearchValue, 300, {
    maxWait: 1000,
  })
  useEffect(() => {
    setDebouncedValue(textSearchValue)
  }, [textSearchValue, setDebouncedValue])

  const text = debouncedValue.length >= 3 ? debouncedValue : ''
  const isSkipped = !text

  const results = useQuery(api.db.thread.messages.searchText, text ? { ...args, text } : 'skip')
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

export const useThreadTextSearchResults = (threadId: string) => {
  const {
    search: [searchValue],
    name: [nameValue],
  } = useThreadTextSearchQueryParams()
  const results = useThreadTextSearch({ threadId, name: nameValue }, searchValue)
  return results
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
