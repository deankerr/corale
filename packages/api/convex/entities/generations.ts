import { defineEnt } from 'convex-ents'
import { literals, v } from '../values'

export const generationSchemaFields = {
  status: literals('queued', 'active', 'done', 'failed'),
  updatedAt: v.number(),
  workflow: v.optional(v.string()),
  input: v.any(),
  output: v.optional(v.any()),
  results: v.optional(
    v.array(
      v.object({
        contentType: v.string(),
        url: v.string(),
        width: v.number(),
        height: v.number(),
      }),
    ),
  ),
  errors: v.optional(v.array(v.any())),
  runId: v.string(),
  ownerId: v.id('users'),
}

export const generationsEnt = defineEnt(generationSchemaFields)
  .field('xid', v.string(), { unique: true })
  .index('status', ['status'])
  .index('runId', ['runId'])
  .index('ownerId', ['ownerId'])
