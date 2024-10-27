import { ConvexError, v, type Infer } from 'convex/values'
import { internal } from '../../_generated/api'
import type { ActionCtx } from '../../_generated/server'
import { OperationsEventLogSchemaFields } from '../../entities/operationsEventLogs/validators'
import { internalMutation, mutation, query } from '../../functions'
import type { MutationCtx } from '../../types'

const createEventArgs = v.object(OperationsEventLogSchemaFields)

export const logOpsEvent = async (ctx: MutationCtx, args: Infer<typeof createEventArgs>) => {
  return await ctx.table('operationsEventLog').insert({
    ...args,
    ack: false,
  })
}

export const logActionOpsEvent = async (ctx: ActionCtx, args: Infer<typeof createEventArgs>) => {
  return await ctx.runMutation(internal.db.admin.events.log, args)
}

export const log = internalMutation({
  args: createEventArgs.fields,
  handler: async (ctx, args) => {
    return await ctx.table('operationsEventLog').insert({
      ...args,
      ack: false,
    })
  },
})

export const latest = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit = 10 }) => {
    const viewer = await ctx.viewerX()
    if (viewer.role !== 'admin') {
      throw new ConvexError('Unauthorized')
    }

    return await ctx.table('operationsEventLog').order('desc').take(limit)
  },
})

export const ack = mutation({
  args: {
    id: v.id('operationsEventLog'),
  },
  handler: async (ctx, { id }) => {
    const viewer = await ctx.viewerX()
    if (viewer.role !== 'admin') {
      throw new ConvexError('Unauthorized')
    }

    return await ctx.table('operationsEventLog').getX(id).patch({ ack: true })
  },
})
