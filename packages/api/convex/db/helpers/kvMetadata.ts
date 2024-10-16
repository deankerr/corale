import { omit } from 'convex-helpers'
import { ConvexError, v } from 'convex/values'

export const updateKvValidator = v.object({
  delete: v.optional(v.array(v.string())),
  set: v.optional(v.record(v.string(), v.string())),
  setUnique: v.optional(v.record(v.string(), v.string())),
})

type KVUpdater = {
  delete?: string[]
  set?: Record<string, string | undefined>
  setUnique?: Record<string, string>
}

export function updateKvMetadata(current: Record<string, string> = {}, kvUpdater?: KVUpdater) {
  if (!kvUpdater) return current

  const kvMetadata = omit(current ?? {}, kvUpdater.delete ?? [])
  if (kvUpdater.set) {
    Object.assign(kvMetadata, kvUpdater.set)
  }

  if (kvUpdater.setUnique) {
    const currentKeys = Object.keys(kvMetadata)
    const duplicateKeys = Object.keys(kvUpdater.setUnique).filter((key) =>
      currentKeys.includes(key),
    )
    if (duplicateKeys.length > 0) {
      throw new ConvexError({
        message: `Duplicate key(s) in setUnique: ${duplicateKeys.join(', ')}`,
        duplicateKeys,
      })
    }
    Object.assign(kvMetadata, kvUpdater.setUnique)
  }

  return kvMetadata
}

export function createKvMetadata(
  kvOptional: Record<string, string | undefined>,
): Record<string, string> {
  const obj = Object.entries(kvOptional).filter(
    (entry): entry is [string, string] => entry[1] !== undefined,
  )
  return Object.fromEntries(obj)
}
