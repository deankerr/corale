import { asyncMap } from 'convex-helpers'
import { v } from 'convex/values'
import { ms } from 'itty-time'
import { z } from 'zod'

import { internal } from './_generated/api'
import { internalMutation } from './functions'

import type { Id, TableNames } from './_generated/dataModel'

const searchTime = ms('2 seconds')
const timeToDelete = ms('1 day')
const deleteFilesDelay = ms('1 minute')

const fileTables: TableNames[] = ['audio', 'images_v2', 'speech']

const argsSchema = z.tuple([
  z.object({
    origin: z.object({
      id: z.string(),
      table: z.string().transform((s) => s as TableNames),
    }),
  }),
])

export const scheduleFileDeletion = internalMutation({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.skipRules.table
      .system('_scheduled_functions', 'by_creation_time', (q) =>
        q.gte('_creationTime', Date.now() - searchTime),
      )
      .order('desc')
      .filter((q) =>
        q.and(
          q.eq(q.field('name'), 'functions.js:scheduledDelete'),
          q.eq(q.field('state.kind'), 'pending'),
        ),
      )

    const toDelete = await asyncMap(items, async (item) => {
      try {
        const args = argsSchema.parse(item.args)
        const { id, table } = args[0].origin

        if (fileTables.includes(table)) {
          const ent = await ctx.unsafeDb.get(id as Id<'images_v2'>)
          const fileId = ent?.fileId
          if (!fileId) {
            console.error('no fileId found for', id, table)
            return null
          }

          console.log('schedule file deletion:', table, id, fileId)
          return { entId: id, table, fileId }
        } else {
          console.log('skipping', table, id)
          return null
        }
      } catch (err) {
        console.error(err)
        return null
      }
    })

    const validToDelete = toDelete.filter((item) => item !== null)
    if (validToDelete.length > 0) {
      await ctx.scheduler.runAfter(timeToDelete + deleteFilesDelay, internal.deletion.deleteFiles, {
        files: validToDelete,
      })
      console.log('scheduled deletions:', validToDelete.length)
    } else {
      console.warn('no files to delete')
    }

    return validToDelete
  },
})

export const deleteFiles = internalMutation({
  args: {
    files: v.array(
      v.object({
        entId: v.string(),
        table: v.string(),
        fileId: v.string(),
      }),
    ),
  },
  handler: async (ctx, { files }) => {
    for (const file of files) {
      const ent = await ctx.unsafeDb.get(file.entId as Id<'images_v2'>)
      if (ent) {
        console.warn('owner of scheduled file deletion still exists')
        continue
      }

      try {
        await ctx.storage.delete(file.fileId as Id<'_storage'>)
        console.log('file deleted', file.table, file.fileId)
      } catch (err) {
        console.error('error deleting file', file.table, file.fileId, err)
      }
    }
  },
})
