import { cronJobs } from 'convex/server'

import { internal } from './_generated/api'

const crons = cronJobs()

crons.daily(
  'import models',
  { hourUTC: 1, minuteUTC: 19 },
  internal.provider.openrouter.updateOpenRouterModels,
)

export default crons
