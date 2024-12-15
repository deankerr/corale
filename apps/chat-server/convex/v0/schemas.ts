import { v } from '#common'
import { defineTable } from 'convex/server'

export const vTreeBranch = v.object({
  id: v.number(),
  parentId: v.optional(v.number()),
  minSeq: v.number(),
  label: v.optional(v.string()),
})

export const vNodeMessageRoles = v.literals('user', 'assistant', 'system', 'tool')

export const vNodeMessageData = v.object({
  role: vNodeMessageRoles,
  name: v.string(),
  content: v.string(),

  data: v.record(v.string(), v.string()),
  userData: v.record(v.string(), v.string()),

  createdAt: v.number(),
})

export const vNodeRunData = v.object({
  conversationNodeIds: v.array(v.string()),
  modelId: v.string(),
  instructions: v.string(),
})

export const vNodesTableFields = {
  uid: v.string(),
  treeId: v.string(),
  seq: v.number(),
  branchId: v.number(),
  branchSeq: v.number(),

  message: v.optional(vNodeMessageData),
  run: v.optional(vNodeRunData),
}

export const vTreesTableFields = {
  uid: v.string(),
  label: v.string(),
  branches: v.array(vTreeBranch),
}

export const treesTables = {
  trees: defineTable(vTreesTableFields).index('by_uid', ['uid']),

  nodes: defineTable(vNodesTableFields)
    .index('by_uid', ['uid'])
    .index('by_treeId_branchId_seq', ['treeId', 'branchId', 'seq'])
    .index('by_treeId_seq_branchId', ['treeId', 'seq', 'branchId']),
}
