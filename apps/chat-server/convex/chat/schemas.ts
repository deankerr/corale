import { v } from '#common'
import { defineTable } from 'convex/server'

export const vChatMessageRoles = v.literals('user', 'assistant', 'system', 'tool')

export const vChatMessage = v.object({
  role: vChatMessageRoles,
  name: v.optional(v.string()),
  text: v.optional(v.string()),
})

export const vCreateChatMessage = v.object({
  role: vChatMessageRoles,
  name: v.optional(v.string()),
  text: v.string(),
  data: v.optional(v.record(v.string(), v.string())),
  userMetadata: v.optional(v.record(v.string(), v.string())),
  branch: v.optional(v.string()),
})

export const vUpdateMessage = v.object({
  role: v.optional(vChatMessageRoles),
  name: v.optional(v.string()),
  text: v.optional(v.string()),
  data: v.optional(v.record(v.string(), v.string())),
  userMetadata: v.optional(v.record(v.string(), v.string())),
})

export const vMessagesTableSchema = {
  role: vChatMessageRoles,
  name: v.optional(v.string()),
  text: v.optional(v.string()),
  data: v.record(v.string(), v.string()),

  userMetadata: v.record(v.string(), v.string()),

  sequence: v.number(),
  branch: v.string(),
  branchSequence: v.number(),

  threadId: v.id('threads'),
}

export const messagesTable = defineTable(vMessagesTableSchema)
  .index('by_thread', ['threadId'])
  .index('by_thread_branch_sequence', ['threadId', 'branch', 'sequence'])

export const vRunsConfig = {
  modelId: v.optional(v.string()),
  instructions: v.optional(v.string()),
}

export const vUpdateThread = v.object({
  title: v.optional(v.string()),
  run: v.optional(v.object(vRunsConfig)),
})

export const vThreadsTableSchema = {
  title: v.optional(v.string()),
  run: v.optional(v.object(vRunsConfig)),
  branches: v.array(v.string()),
}

export const threadsTable = defineTable(vThreadsTableSchema)
