import type { Infer } from 'convex/values'
import type { MessageReturn } from './messages/validators'

export type Message = Infer<typeof MessageReturn>
