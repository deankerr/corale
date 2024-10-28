import { ConvexError, v, type Infer } from 'convex/values'
import { internal } from '../../_generated/api'
import type { ActionCtx } from '../../_generated/server'
import { internalMutation, mutation, query } from '../../functions'
import type { MutationCtx } from '../../types'
import { OperationsEventLogSchemaFields } from './validators'

export const log = internalMutation({
  args: OperationsEventLogSchemaFields,
  handler: async (ctx, args) => {
    return await ctx.table('operationsEventLog').insert({
      ...args,
      ack: false,
    })
  },
})
