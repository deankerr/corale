import { internalMutation } from '../../functions'
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
