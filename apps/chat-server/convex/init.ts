import { internal } from '#api'
import { asyncMap, type TableNames } from '#common'
import { internalAction, internalMutation, query } from './_generated/server'

export const hello = query(async () => 'hello from chat-server/convex')

export const deleteAll = internalMutation(async (ctx) => {
  const tables: TableNames[] = ['messages', 'threads']
  console.log('deleting all', tables)
  await asyncMap(tables, async (table) => {
    const docs = await ctx.db.query(table).collect()
    await asyncMap(docs, async (doc) => {
      await ctx.db.delete(doc._id)
    })
  })
})

const init = internalAction(async (ctx) => {
  await ctx.runMutation(internal.init.deleteAll)
  console.log('deleted all')
})

export default init
