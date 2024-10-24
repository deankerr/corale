import type { GenericEnt, GenericEntWriter } from 'convex-ents'
import type { CustomCtx } from 'convex-helpers/server/customFunctions'
import type { AsObjectValidator, Infer } from 'convex/values'
import type { TableNames } from './_generated/dataModel'
import type { textToImageInputs } from './db/generations'
import type { imagesReturn } from './db/images'
import type { messageReturnFields } from './db/messages'
import type { chatModelReturn } from './db/models'
import type { patternReturnFields } from './db/patterns'
import type { runReturnFields } from './db/runs'
import type { threadReturnFields } from './db/threads'
import type { userReturnFieldsPublic } from './db/users'
import type { mutation, query } from './functions'
import type { entDefinitions } from './schema'

export type { Id, Doc } from './_generated/dataModel'
export type { SystemFields, WithOptionalSystemFields, WithoutSystemFields } from 'convex/server'

export type QueryCtx = CustomCtx<typeof query>
export type MutationCtx = CustomCtx<typeof mutation>
export type Ent<TableName extends TableNames> = GenericEnt<typeof entDefinitions, TableName>
export type EntWriter<TableName extends TableNames> = GenericEntWriter<typeof entDefinitions, TableName>

export type EPattern = Infer<AsObjectValidator<typeof patternReturnFields>>
export type EThread = Infer<AsObjectValidator<typeof threadReturnFields>>
export type EMessage = Infer<AsObjectValidator<typeof messageReturnFields>>
export type EImage = Infer<AsObjectValidator<typeof imagesReturn>>
export type EUser = Infer<AsObjectValidator<typeof userReturnFieldsPublic>>
export type ERun = Infer<AsObjectValidator<typeof runReturnFields>>
export type EChatModel = Infer<AsObjectValidator<typeof chatModelReturn>>

export type TextToImageInputs = Infer<typeof textToImageInputs>
