import type { GenericId } from 'convex/values'
import { ms } from 'itty-time'
import { internal } from './_generated/api'
import type { Id, TableNames } from './_generated/dataModel'
import { deletionDelayTime } from './constants'
import { internalMutation } from './functions'
import type { MutationCtx } from './types'
import { v } from './values'

/* 
  Example scheduled delete function:
  {
    _creationTime: 1729300346208.9146,
    _id: "kc24319m7hm4nxwcxc18megdsn72y4nk",
    args: [
      {
        inProgress: false,
        origin: {
          deletionTime: 1729300346209, // time the document was deleted, not when it will be
          id: "js788a2th6e982gnzx556phvqs72rax0",
          table: "threads",
        },
        stack: [],
      },
    ],
    name: "functions.js:scheduledDelete",
    scheduledTime: 1729386746209,
    state: { kind: "pending" },
  }
*/

type BasicDocument = {
  _id: GenericId<TableNames>
  deletionTime?: number
  fileId?: Id<'_storage'>
}

const checkFilesDelay = ms('1 minute')
const ignoreTables = [
  'threads',
  'messages',
  'texts',
  'patterns',
  'users',
  'users_api_keys',
  'runs',
  'operationsEventLog',
  'migrations',
]

async function scheduleValidFileDoc(ctx: MutationCtx, doc: BasicDocument | null) {
  if (!doc || !doc.fileId || !doc.deletionTime) return

  const checkTime = doc.deletionTime + deletionDelayTime + checkFilesDelay
  if (checkTime > Date.now()) {
    await ctx.scheduler.runAt(checkTime, internal.files.deleteDocFile, { docId: doc._id, fileId: doc.fileId })
  } else {
    console.error('deletion time was in the past', doc._id)
    await ctx.scheduler.runAfter(checkFilesDelay, internal.files.deleteDocFile, {
      docId: doc._id,
      fileId: doc.fileId,
    })
  }
  console.debug('queued', doc._id, ':', doc.fileId)
}

export const startDeletionScan = internalMutation({
  args: {},
  handler: async (ctx) => {
    const scheduledDeletions = await ctx.table
      .system('_scheduled_functions', 'by_creation_time', (q) => q.gte('_creationTime', Date.now() - deletionDelayTime))
      .order('desc')
      .filter((q) =>
        q.and(q.eq(q.field('name'), 'functions.js:scheduledDelete'), q.eq(q.field('state.kind'), 'pending')),
      )

    for (const func of scheduledDeletions) {
      const args = func.args[0]
      if (!args || ignoreTables.includes(args.origin.table)) continue
      const doc = await ctx.db.get(args.origin.id as Id<any>)
      await scheduleValidFileDoc(ctx, doc)
    }
  },
})

export const deleteDocFile = internalMutation({
  args: {
    docId: v.string(),
    fileId: v.id('_storage'),
  },
  handler: async (ctx, { docId, fileId }) => {
    const doc = await ctx.db.get(docId as Id<any>)
    if (doc) return await scheduleValidFileDoc(ctx, doc)

    await ctx.storage.delete(fileId as Id<'_storage'>)
    console.debug('deleted', docId, ':', fileId)
  },
})
