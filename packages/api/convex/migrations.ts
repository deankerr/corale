import { makeMigration, startMigrationsSerially } from 'convex-helpers/server/migrations'
import { internal } from './_generated/api'
import { internalMutation } from './_generated/server'
import { generateXID } from './db/helpers/xid'

export const migration = makeMigration(internalMutation, {
  migrationTable: 'migrations',
})

export const xidThreads = migration({
  table: 'threads',
  migrateOne: async (ctx, doc) => {
    return { ...doc, slug: undefined }
  },
})

export const xidMessages = migration({
  table: 'messages',
  migrateOne: async (ctx, doc) => {
    return { xid: generateXID() }
  },
  batchSize: 400,
})

export const xidCollections = migration({
  table: 'collections',
  migrateOne: async (ctx, doc) => {
    return { xid: doc.id }
  },
})

export const xidImages = migration({
  table: 'images_v2',
  migrateOne: async (ctx, doc) => {
    return { xid: doc.id }
  },
})

export const xidPatterns = migration({
  table: 'patterns',
  migrateOne: async (ctx, doc) => {
    return { xid: generateXID() }
  },
})

export const xidGenerations = migration({
  table: 'generations_v2',
  migrateOne: async (ctx, doc) => {
    return { xid: generateXID() }
  },
})

export const xidAudio = migration({
  table: 'audio',
  migrateOne: async (ctx, doc) => {
    return { xid: generateXID() }
  },
})

export const xidRuns = migration({
  table: 'runs',
  migrateOne: async (ctx, doc) => {
    return { xid: generateXID() }
  },
})

export default internalMutation(async (ctx) => {
  await startMigrationsSerially(ctx, [
    internal.migrations.xidThreads,
    internal.migrations.xidMessages,
    internal.migrations.xidCollections,
    internal.migrations.xidImages,
    internal.migrations.xidPatterns,
    internal.migrations.xidGenerations,
    internal.migrations.xidAudio,
    internal.migrations.xidRuns,
  ])
})
