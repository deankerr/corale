import { customAlphabet } from 'nanoid/non-secure'
import { ConvexError, literals, v, type Value } from '../values'

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

export const generateRandomString = (length: number) => {
  const generate = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
  return generate(length)
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

export function insist<T>(condition: T, message: string, data?: Record<string, Value>): asserts condition {
  if (!condition) throw new ConvexError({ ...data, message })
}

export function raise(message: string, data?: Record<string, Value>): never {
  throw new ConvexError({ ...data, message })
}

export function getErrorMessage(error: unknown) {
  if (typeof error === 'string') return error
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message
  }
  console.error('Unable to get error message for error', error)
  return 'Unknown Error'
}
