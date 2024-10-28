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

const isDev = process.env.CONVEX_ENV === 'development'
export const scheduledDeletionDelayMS = isDev ? ms('2 minutes') : ms('24 hours')
