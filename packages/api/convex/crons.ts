import { cronJobs } from 'convex/server'
import { internal } from './_generated/api'
import { timeToDeleteSchedule } from './schema'

const crons = cronJobs()

crons.daily('import models', { hourUTC: 1, minuteUTC: 19 }, internal.provider.openrouter.updateOpenRouterModels)
crons.interval(
  'document fileId deletion scan',
  { seconds: Math.floor(timeToDeleteSchedule / 1000) },
  internal.files.startDeletionScan,
  {},
)

export default crons
