import { api, type Pattern } from '@corale/api'
import { omit } from 'convex-helpers'
import { useMutation } from 'convex/react'
import { useCachedQuery } from './helpers'

export const usePatterns = (enabled: boolean = true) => {
  return useCachedQuery(api.entities.patterns.public.listMy, enabled ? {} : 'skip')
}

export const usePattern = (patternId?: string) => {
  return useCachedQuery(api.entities.patterns.public.get, patternId ? { patternId } : 'skip')
}

export function useCreatePattern() {
  const create = useMutation(api.entities.patterns.public.create)
  return (newPattern: Pattern) => {
    const fields = prepareUpdate(newPattern)
    const { xid, ...rest } = fields
    return create(rest)
  }
}

export function useUpdatePattern() {
  const sendUpdate = useMutation(api.entities.patterns.public.update)
  return (newPattern: Pattern) => {
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

export function prepareUpdate(newPattern: Pattern) {
  return {
    ...omit(newPattern, ['_creationTime', 'updatedAt', 'lastUsedAt', 'userId', '_id', 'initialMessages']),
    initialMessages: newPattern.initialMessages.map((message) => ({
      ...message,
      __key: undefined,
    })),
  }
}

export function useDeletePattern() {
  return useMutation(api.entities.patterns.public.remove)
}
