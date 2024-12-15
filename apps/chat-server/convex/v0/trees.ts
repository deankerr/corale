import { mutation, query, v } from '#common'
import { trees } from './helpers/trees'
import { vNodeMessageRoles, vNodeRunData } from './schemas'

export const get = query({
  args: {
    treeId: v.string(),
  },
  handler: async (ctx, args) => {
    return await trees.get(ctx, args.treeId)
  },
})

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await trees.list(ctx)
  },
})

export const create = mutation({
  args: {
    label: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await trees.create(ctx, args)
  },
})

export const vAppendArgs = {
  treeId: v.string(),
  branchId: v.optional(v.number()),
  message: v.object({
    role: vNodeMessageRoles,
    name: v.string(),
    content: v.string(),
    userData: v.record(v.string(), v.string()),
  }),
  run: v.optional(v.object(v.partial(vNodeRunData.fields))),
}

export const append = mutation({
  args: vAppendArgs,
  handler: async (ctx, args) => {
    return await trees.append(ctx, args)
  },
})

export const branch = mutation({
  args: {
    treeId: v.string(),
    nodeId: v.string(),
    label: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await trees.branch(ctx, args)
  },
})

export const listAllNodes = query({
  args: {
    treeId: v.string(),
  },
  handler: async (ctx, args) => {
    return await trees.nodes.listAll(ctx, args)
  },
})

export const listAllNodesByBranch = query({
  args: {
    treeId: v.string(),
  },
  handler: async (ctx, args) => {
    return await trees.nodes.listAllByBranch(ctx, args)
  },
})
