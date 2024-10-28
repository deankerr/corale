import { internalMutation, internalQuery, query } from '../../functions'
import type { QueryCtx } from '../../types'
import { partial, v, withSystemFields } from '../../values'
import { ChatModelSchemaFields } from './validators'

export const getChatModel = async (ctx: QueryCtx, modelId: string) => {
  const model = await ctx
    .table('chat_models')
    .filter((q) => q.eq(q.field('modelId'), modelId))
    .first()
  return model
}
