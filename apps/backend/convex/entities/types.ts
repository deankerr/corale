import type { Infer } from 'convex/values'
import type { ChatModelReturn } from './chatModels/validators'
import type { CollectionReturn } from './collections/validators'
import type { GenerationReturn } from './generations/validators'
import type { ImageReturn } from './images/validators'
import type { PatternReturn } from './patterns/validators'
import type { MessageRoles, TextToImageInputs } from './shared'
import type { MessageReturn } from './threads/messages/models'
import type { ThreadReturn, ThreadWithDetailsReturn } from './threads/models'
import type { RunReturn } from './threads/runs/models'
import type { UserReturn } from './users/validators'

export type ChatModel = Infer<typeof ChatModelReturn>
export type Collection = Infer<typeof CollectionReturn>
export type Generation = Infer<typeof GenerationReturn>
export type Image = Infer<typeof ImageReturn>
export type Message = Infer<typeof MessageReturn>
export type Pattern = Infer<typeof PatternReturn>
export type Run = Infer<typeof RunReturn>
export type Thread = Infer<typeof ThreadReturn>
export type ThreadWithDetails = Infer<typeof ThreadWithDetailsReturn>
export type User = Infer<typeof UserReturn>

export type MessageRoles = Infer<typeof MessageRoles>
export type TextToImageInputs = Infer<typeof TextToImageInputs>

export type XIDTableNames =
  | 'audio'
  | 'collections'
  | 'generations_v2'
  | 'images_v2'
  | 'messages'
  | 'patterns'
  | 'runs'
  | 'threads'
