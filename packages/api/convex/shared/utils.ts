import { ConvexError } from 'convex/values'

import type { Value } from 'convex/values'

export function env(name: string) {
  const value = process.env[name]
  insist(value, `Environment variable is undefined: ${name}`)
  return value
}

export function createError(
  message: string,
  {
    fatal = false,
    code = 'unhandled',
    data,
  }: { fatal?: boolean; code?: string; data?: Record<string, Value> } = {},
) {
  return new ConvexError({ message, fatal, code, data })
}

export function insist<T>(
  condition: T,
  message: string,
  data?: Record<string, Value>,
): asserts condition {
  if (!condition)
    throw new ConvexError({ ...data, message: `assertion failed: ${message}`, fatal: true })
}

export function getErrorMessage(error: unknown) {
  if (typeof error === 'string') return error
  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
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
