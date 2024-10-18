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

export function createError(
  message: string,
  { fatal = false, code = 'unhandled', data }: { fatal?: boolean; code?: string; data?: Record<string, Value> } = {},
) {
  return new ConvexError({ message, fatal, code, data })
}

export function insist<T>(condition: T, message: string, data?: Record<string, Value>): asserts condition {
  if (!condition) throw new ConvexError({ ...data, message: `assertion failed: ${message}`, fatal: true })
}

export function getErrorMessage(error: unknown) {
  if (typeof error === 'string') return error
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message
  }
  console.error('Unable to get error message for error', error)
  return 'Unknown Error'
}

// from 'convex/values'
export function stringifyValueForError(value: any) {
  if (typeof value === 'string') return value

  return JSON.stringify(value, (_key, value) => {
    if (value === undefined) {
      // By default `JSON.stringify` converts undefined, functions, symbols, Infinity, and NaN to null which produces a confusing error message.
      // We deal with `undefined` specifically because it's the most common.
      return 'undefined'
    }
    if (typeof value === 'bigint') {
      // `JSON.stringify` throws on bigints by default.
      return `${value.toString()}n`
    }
    return value
  })
}

export function parseJson(input: string): unknown {
  try {
    return JSON.parse(input)
  } catch (error) {
    console.error('Unable to parse JSON', input, error)
    return undefined
  }
}

export function getURLIfValid(url: string) {
  try {
    return new URL(url)
  } catch {
    return null
  }
}

export function getAppHostname() {
  const hostname = process.env.NEXT_PUBLIC_APP_HOSTNAME ?? process.env.APP_HOSTNAME
  if (!hostname) throw new ConvexError('APP_HOSTNAME is not set')
  return hostname
}

export function extractValidUrlsFromText(text: string): URL[] {
  const ignoredUrls = [getAppHostname(), 'www.w3.org/2000/svg']

  const urlRegex = /(https?:\/\/[^\s]+)/g
  const matches = text.match(urlRegex) || []
  return matches
    .map(getURLIfValid)
    .filter((url): url is URL => url !== null && !ignoredUrls.some((ignored) => url.href.includes(ignored)))
}

export function hasDelimiter(text: string) {
  return text.includes('\n') || text.includes('.') || text.includes('?') || text.includes('!') || text.length >= 200
}
