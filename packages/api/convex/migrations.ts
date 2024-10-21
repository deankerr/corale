import { makeMigration } from 'convex-helpers/server/migrations'
import { internalMutation } from './_generated/server'
import { createGenerationMetadata } from './db/images'
import { Doc } from './types'

export const migration = makeMigration(internalMutation, {
  migrationTable: 'migrations',
})

export const imageMetadataTypes = migration({
  table: 'images_metadata_v2',
  migrateOne: async (ctx, doc: Doc<'images_metadata_v2'>) => {
    return { ...doc, type: doc.data.type }
  },
  batchSize: 400,
})

export const addGenData_1 = migration({
  table: 'generations_v2',
  migrateOne: async (ctx, doc) => {
    const images = await ctx.db
      .query('images_v2')
      .withIndex('generationId', (q) => q.eq('generationId', doc._id))
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .collect()

    for (const image of images) {
      const metadata = createGenerationMetadata(doc, image.sourceUrl)
      await ctx.db.insert('images_metadata_v2', { data: metadata, type: 'generation', imageId: image._id })
    }
  },
})

// export const xidThreadsR = migration({
//   table: 'threads',
//   migrateOne: async (ctx, doc) => {
//     return { ...doc, slug: undefined }
//   },
// })

// export const xidMessages = migration({
//   table: 'messages',
//   migrateOne: async (ctx, doc) => {
//     return { xid: generateXID() }
//   },
//   batchSize: 400,
// })

// export const xidCollectionsR = migration({
//   table: 'collections',
//   migrateOne: async (ctx, doc) => {
//     return { ...doc, id: undefined }
//   },
// })

// export const xidImagesR = migration({
//   table: 'images_v2',
//   migrateOne: async (ctx, doc) => {
//     return { ...doc, id: undefined }
//   },
// })

// export const xidPatterns = migration({
//   table: 'patterns',
//   migrateOne: async (ctx, doc) => {
//     return { xid: generateXID() }
//   },
// })

// export const xidGenerations = migration({
//   table: 'generations_v2',
//   migrateOne: async (ctx, doc) => {
//     return { xid: generateXID() }
//   },
// })

// export const xidAudio = migration({
//   table: 'audio',
//   migrateOne: async (ctx, doc) => {
//     return { xid: generateXID() }
//   },
// })

// export const xidRuns = migration({
//   table: 'runs',
//   migrateOne: async (ctx, doc) => {
//     return { xid: generateXID() }
//   },
// })

// export const rmIds = internalMutation(async (ctx) => {
//   await startMigrationsSerially(ctx, [
//     internal.migrations.xidThreadsR,
//     internal.migrations.xidMessages,
//     internal.migrations.xidCollectionsR,
//     internal.migrations.xidImagesR,
//     internal.migrations.xidPatterns,
//     internal.migrations.xidGenerations,
//     internal.migrations.xidAudio,
//     internal.migrations.xidRuns,
//   ])
// })
