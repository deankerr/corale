import type { Infer } from 'convex/values'
import type { ChatModelReturn } from './chatModels/validators'
import type { CollectionReturn } from './collections/validators'
import type { GenerationReturn } from './generations/validators'
import type { ImageReturn } from './images/validators'
import type { MessageReturn } from './messages/validators'
import type { PatternReturn } from './patterns/validators'
import type { RunReturn } from './runs/validators'
import type { TextToImageInputs } from './shared'
import type { ThreadReturn } from './threads/validators'
import type { UserReturn } from './users/validators'

export type ChatModel = Infer<typeof ChatModelReturn>
export type Collection = Infer<typeof CollectionReturn>
export type Generation = Infer<typeof GenerationReturn>
export type Image = Infer<typeof ImageReturn>
export type Message = Infer<typeof MessageReturn>
export type Pattern = Infer<typeof PatternReturn>
export type Run = Infer<typeof RunReturn>
export type Thread = Infer<typeof ThreadReturn>
export type User = Infer<typeof UserReturn>

export type TextToImageInputs = Infer<typeof TextToImageInputs>