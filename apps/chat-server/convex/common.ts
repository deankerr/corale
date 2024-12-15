import {
  brandedString,
  deprecated,
  literals,
  nullable,
  partial,
  pretend,
  pretendRequired,
  systemFields,
  withSystemFields,
} from 'convex-helpers/validators'
import { v as convexV } from 'convex/values'

export { ConvexError } from 'convex/values'
export { paginationOptsValidator } from 'convex/server'
export { asyncMap, omit, pick, pruneNull } from 'convex-helpers'

export type * from './_generated/dataModel'
export * from './_generated/server'

/**
 * Convex validator builder with additional helpers
 */
export const v = {
  ...convexV,
  deprecated,
  literals,
  partial,
  pretend,
  pretendRequired,
  systemFields,
  withSystemFields,
  nullable,
  brandedString,
}
