import { cronJobs } from 'convex/server'
import { internal } from './_generated/api'

const crons = cronJobs()

crons.interval('import openrouter models', { hours: 12 }, internal.provider.openrouter.updateOpenRouterModels, {})

crons.interval('orphaned files deletion', { hours: 23 }, internal.files.startDeletionScan, {})

export default crons
