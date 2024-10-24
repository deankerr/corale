import { ms } from 'itty-time'

export { paginationOptsValidator } from 'convex/server'
export { asyncMap, omit, pick, pruneNull } from 'convex-helpers'
export type { BetterOmit } from 'convex-helpers'
export {
  deprecated,
  literals,
  partial,
  pretend,
  pretendRequired,
  systemFields,
  withSystemFields,
  nullable,
  brandedString,
} from 'convex-helpers/validators'

export { asObjectValidator, ConvexError, v, type Value, type Infer, type AsObjectValidator } from 'convex/values'

export const entityScheduledDeletionDelay = ms('24 hours')
