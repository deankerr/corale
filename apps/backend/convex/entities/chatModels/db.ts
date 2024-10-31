import type { QueryCtx } from '../../types'

export const getChatModel = async (ctx: QueryCtx, modelId: string) => {
  const model = await ctx
    .table('chat_models')
    .filter((q) => q.eq(q.field('modelId'), modelId))
    .first()
  return model
}
