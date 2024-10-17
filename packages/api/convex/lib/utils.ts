import { literals } from 'convex-helpers/validators'
import { Infer, v } from 'convex/values'
import { customAlphabet } from 'nanoid/non-secure'
import type { MutationCtx } from '../types'

// see https://github.com/xixixao/saas-starter/blob/main/convex/utils.ts
// permanent loading state for a paginated query until a different result is returned
export function emptyPage() {
  return {
    page: [],
    isDone: false,
    continueCursor: '',
    pageStatus: 'SplitRequired' as const,
  }
}

export const paginatedReturnFields = {
  isDone: v.boolean(),
  continueCursor: v.string(),
  splitCursor: v.optional(v.union(v.string(), v.null())),
  pageStatus: v.optional(v.union(literals('SplitRequired', 'SplitRecommended'), v.null())),
}

export const generateSlug = async (ctx: MutationCtx) => {
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789')

  async function getAvailableSlug(): Promise<string> {
    const slug = nanoid(8)
    const existing = await ctx.table('threads', 'slug', (q) => q.eq('slug', slug)).first()
    return existing ? await getAvailableSlug() : slug
  }

  return await getAvailableSlug()
}

export const generateRandomString = (length: number) => {
  const generate = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
  return generate(length)
}

const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const EPOCH_START = 1713398400000
const ID_PADDING = 3

function generateBase62Timestamp(timestamp: number): string {
  // Calculate the number of seconds since the epoch start
  const secondsSinceEpoch = Math.floor((timestamp - EPOCH_START) / 1000)

  // Ensure we don't exceed the maximum value for 5 base-62 characters
  const maxValue = Math.pow(62, 5) - 1
  const normalizedSeconds = secondsSinceEpoch % (maxValue + 1)

  let result = ''
  let remaining = normalizedSeconds

  // Convert to base-62
  for (let i = 0; i < 5; i++) {
    const index = remaining % 62
    result = BASE62[index] + result
    remaining = Math.floor(remaining / 62)
  }

  return result.padStart(5, '0')
}

export function generateTimestampId(timestamp: number, pad = ID_PADDING): string {
  const base62Timestamp = generateBase62Timestamp(timestamp)
  const padding = customAlphabet(BASE62, pad)()
  return `${base62Timestamp}${padding}`
}

export function generateSlugId(length = 8) {
  const nanoid = customAlphabet(BASE62, length)
  return nanoid()
}

type DefaultValues<T> = {
  [K in keyof T]?: T[K] | null
}

/**
 * Prepares an object for updating by removing undefined values and applying defaults.
 *
 * @param updates - The object containing the updates.
 * @param defaults - An object containing default values for fields.
 * @returns An object safe to use with Convex's patch method.
 */
export function prepareUpdate<T extends Record<string, any>>(
  updates: Partial<T>,
  defaults: DefaultValues<T> = {},
): Partial<T> {
  const result: Partial<T> = {}

  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined) {
      if (key in defaults) {
        result[key as keyof T] = defaults[key as keyof T] as T[keyof T]
      }
      // If the key is not in defaults, we omit it entirely
    } else {
      result[key as keyof T] = value
    }
  }

  return result
}
