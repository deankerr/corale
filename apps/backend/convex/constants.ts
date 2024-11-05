import { ms } from 'itty-time'

export const deletionDelayTime = ms('24 hours')

export const maxConversationMessages = 50

export const maxQueuedRunsPerThread = 4
export const maxConcurrentRunsPerThread = 1
export const maxRunQueuedTimeDuration = ms('10 minutes')
export const runQueueDelayBase = ms('4 seconds')
