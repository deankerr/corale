import { entsTableFactory, scheduledDeleteFactory } from 'convex-ents'
import { customCtx, customMutation, customQuery } from 'convex-helpers/server/customFunctions'
import { ConvexError, v } from 'convex/values'
import {
  action as baseAction,
  internalAction as baseInternalAction,
  internalMutation as baseInternalMutation,
  internalQuery as baseInternalQuery,
  mutation as baseMutation,
  query as baseQuery,
  type MutationCtx as BaseMutationCtx,
  type QueryCtx as BaseQueryCtx,
} from './_generated/server'
import { getEntDefinitionsWithRules, getViewerIdFromApiKey, getViewerIdFromAuth } from './rules'
import { entDefinitions } from './schema'

export const scheduledDelete = scheduledDeleteFactory(entDefinitions)

// * Queries
export const query = customQuery(baseQuery, {
  args: { apiKey: v.optional(v.string()) },
  input: async (baseCtx, { apiKey }) => {
    return { ctx: await queryCtx(baseCtx, apiKey), args: {} }
  },
})

export const internalQuery = customQuery(
  baseInternalQuery,
  customCtx(async (baseCtx) => {
    return await queryCtx(baseCtx)
  }),
)

async function queryCtx(baseCtx: BaseQueryCtx, apiKey?: string) {
  const ctx = {
    unsafeDb: baseCtx.db,
    db: undefined as unknown as typeof baseCtx.db,
    skipRules: { table: entsTableFactory(baseCtx, entDefinitions) },
  }

  const authViewerId = await getViewerIdFromAuth({ ...baseCtx, ...ctx })
  const apiKeyViewerId = await getViewerIdFromApiKey({ ...baseCtx, ...ctx }, apiKey)
  const viewerId = apiKeyViewerId ?? authViewerId

  const entDefinitionsWithRules = getEntDefinitionsWithRules({ ...ctx, viewerId } as any)
  const table = entsTableFactory(baseCtx, entDefinitionsWithRules)

  const viewer = async () => (viewerId !== null ? await table('users').get(viewerId) : null)
  const viewerX = async () => {
    const ent = await viewer()
    if (ent === null) throw new ConvexError('Expected authenticated viewer')
    return ent
  }

  return { ...ctx, table, viewer, viewerX, viewerId }
}

// * Mutations
export const mutation = customMutation(baseMutation, {
  args: { apiKey: v.optional(v.string()) },
  input: async (baseCtx, { apiKey }) => {
    return { ctx: await mutationCtx(baseCtx, apiKey), args: {} }
  },
})

export const internalMutation = customMutation(
  baseInternalMutation,
  customCtx(async (baseCtx) => {
    return await mutationCtx(baseCtx)
  }),
)

async function mutationCtx(baseCtx: BaseMutationCtx, apiKey?: string) {
  const ctx = {
    unsafeDb: baseCtx.db,
    db: undefined as unknown as typeof baseCtx.db,
    skipRules: { table: entsTableFactory(baseCtx, entDefinitions) },
  }

  const authViewerId = await getViewerIdFromAuth({ ...baseCtx, ...ctx })
  const apiKeyViewerId = await getViewerIdFromApiKey({ ...baseCtx, ...ctx }, apiKey)
  const viewerId = apiKeyViewerId ?? authViewerId

  const entDefinitionsWithRules = getEntDefinitionsWithRules({ ...ctx, viewerId } as any)
  const table = entsTableFactory(baseCtx, entDefinitionsWithRules)

  const viewer = async () => (viewerId !== null ? await table('users').get(viewerId) : null)
  const viewerX = async () => {
    const ent = await viewer()
    if (ent === null) throw new ConvexError('Expected authenticated viewer')
    return ent
  }

  return { ...ctx, table, viewer, viewerX, viewerId }
}

export const action = baseAction
export const internalAction = baseInternalAction
