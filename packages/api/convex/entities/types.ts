import type { Infer } from 'convex/values'
import type { MessageReturn } from './messages/validators'
import type { ThreadReturn } from './threads/validators'

export type Message = Infer<typeof MessageReturn>
export type Thread = Infer<typeof ThreadReturn>
