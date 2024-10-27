import type { Infer } from 'convex/values'
import type { MessageReturn } from './messages/validators'
import type { TextToImageInputs } from './shared'
import type { ThreadReturn } from './threads/validators'
import type { UserReturn } from './users/validators'

export type Message = Infer<typeof MessageReturn>
export type Thread = Infer<typeof ThreadReturn>
export type User = Infer<typeof UserReturn>

export type TextToImageInputs = Infer<typeof TextToImageInputs>
