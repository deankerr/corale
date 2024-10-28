import { ConvexError, v, type AsObjectValidator, type Infer } from 'convex/values'
import { internal } from '../../_generated/api'
import type { ActionCtx } from '../../_generated/server'
import { OperationsEventLogSchemaFields } from '../../entities/operationsEventLogs/validators'
import { internalMutation, mutation, query } from '../../functions'
import type { MutationCtx } from '../../types'

export const logOpsEvent = async (
  ctx: MutationCtx,
  args: Infer<AsObjectValidator<typeof OperationsEventLogSchemaFields>>,
) => {
  return await ctx.table('operationsEventLog').insert({
    ...args,
    ack: false,
  })
}

export const logActionOpsEvent = async (
  ctx: ActionCtx,
  args: Infer<AsObjectValidator<typeof OperationsEventLogSchemaFields>>,
) => {
  return await ctx.runMutation(internal.entities.operationsEventLogs.action.log, args)
}
