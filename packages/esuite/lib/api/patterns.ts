import { api } from '@corale/api/convex/_generated/api'
import type { EPattern } from '@corale/api/convex/types'
import { omit } from 'convex-helpers'
import { useMutation } from 'convex/react'
import { useCachedQuery } from './helpers'

export const usePatterns = () => {
  return useCachedQuery(api.db.patterns.list, {})
}

export const usePattern = (patternId?: string) => {
  return useCachedQuery(api.db.patterns.get, patternId ? { patternId } : 'skip')
}

export function useCreatePattern() {
  const create = useMutation(api.db.patterns.create)
  return (newPattern: EPattern) => {
    const fields = prepareUpdate(newPattern)
    const { xid, ...rest } = fields
    return create(rest)
  }
}

export function useUpdatePattern() {
  const sendUpdate = useMutation(api.db.patterns.update)
  return (newPattern: EPattern) => {
    const update = prepareUpdate(newPattern)
    const { xid, ...fields } = update
    return sendUpdate({
      patternId: xid,
      fields: {
        ...fields,
        initialMessages: newPattern.initialMessages.map((message) => ({
          role: message.role,
          text: message.text,
          name: message.name,
          channel: message.channel,
        })),
      },
    })
  }
}

export function prepareUpdate(newPattern: EPattern) {
  return {
    ...omit(newPattern, ['_creationTime', 'updatedAt', 'lastUsedAt', 'userId', '_id', 'initialMessages']),
    initialMessages: newPattern.initialMessages.map((message) => ({
      ...message,
      __key: undefined,
    })),
  }
}

export function useDeletePattern() {
  return useMutation(api.db.patterns.remove)
}
