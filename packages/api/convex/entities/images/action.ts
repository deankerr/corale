import { internalMutation, internalQuery } from '../../functions'
import { omit, v } from '../../values'
import { generateXID } from '../helpers'
import { createGenerationMetadata } from '../imagesMetadata/db'
import { getImage } from './db'
import { ImageSchemaFields } from './validators'

export const get = internalQuery({
  args: {
    imageId: v.string(),
  },
  handler: async (ctx, { imageId }) => {
    return await getImage(ctx, { imageId })
  },
})

export const create = internalMutation({
  args: {
    ...omit(ImageSchemaFields, ['createdAt']),
    createdAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const createdAt = args.createdAt ?? Date.now()

    const xid = generateXID()
    const _id = await ctx.skipRules.table('images_v2').insert({
      ...args,
      createdAt,
      xid,
    })

    const generation = args.generationId ? await ctx.table('generations_v2').get(args.generationId) : null
    if (generation) {
      try {
        const data = createGenerationMetadata(generation, args.sourceUrl)
        await ctx.table('images_metadata_v2').insert({ data, type: 'generation', imageId: _id })
      } catch (err) {
        console.error('Failed to get generation metadata', err)
      }
    }

    return xid
  },
})
