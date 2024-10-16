import { asyncMap, omit, pruneNull } from 'convex-helpers'
import { literals } from 'convex-helpers/validators'
import { v } from 'convex/values'

import { internal } from '../../_generated/api'
import { messageFields } from '../../schema'
import { extractValidUrlsFromText } from '../../shared/helpers'
import { getImageV2ByOwnerIdSourceUrl } from '../images'

import type { Doc } from '../../_generated/dataModel'
import type { Ent, MutationCtx, QueryCtx } from '../../types'
import type { WithoutSystemFields } from 'convex/server'

export const messageCreateFields = {
  ...omit(messageFields, ['runId']),
}

export const messageReturnFields = {
  // doc
  _id: v.id('messages'),
  _creationTime: v.number(),
  role: literals('system', 'assistant', 'user'),
  name: v.optional(v.string()),
  text: v.optional(v.string()),
  channel: v.optional(v.string()),
  kvMetadata: v.record(v.string(), v.string()),
  runId: v.optional(v.id('runs')),
  runId_v2: v.optional(v.string()),

  // fields
  series: v.number(),
  threadId: v.id('threads'),
  userId: v.id('users'),

  // edges
  threadSlug: v.string(),
}

// * query helpers
export const getMessageEdges = async (ctx: QueryCtx, message: Ent<'messages'>) => {
  const thread = await message.edgeX('thread')
  return {
    ...message.doc(),
    threadSlug: thread.slug,
    kvMetadata: message.kvMetadata ?? {},
  }
}

export const getMessageUrlImages = async (ctx: QueryCtx, message: Ent<'messages'>) => {
  const urls = extractValidUrlsFromText(message.text || '')

  const results = await asyncMap(
    urls,
    async (url) => await getImageV2ByOwnerIdSourceUrl(ctx, message.userId, url.toString()),
  )
  return pruneNull(results)
}

export const createMessage = async (
  ctx: MutationCtx,
  fields: Omit<WithoutSystemFields<Doc<'messages'>>, 'series' | 'deletionTime'>,
  options?: {
    skipRules?: boolean
    evaluateUrls?: boolean
    generateThreadTitle?: boolean
  },
) => {
  const skipRules = options?.skipRules ?? false
  const evaluateUrls = options?.evaluateUrls ?? fields.role === 'user'
  const generateThreadTitle = options?.generateThreadTitle ?? fields.role === 'assistant'

  const thread = await ctx.skipRules.table('threads').getX(fields.threadId)

  const prev = await thread.edge('messages').order('desc').first()
  const series = prev ? prev.series + 1 : 1

  const message = skipRules
    ? await ctx.skipRules
        .table('messages')
        .insert({ ...fields, series })
        .get()
    : await ctx
        .table('messages')
        .insert({ ...fields, series })
        .get()

  if (evaluateUrls) {
    if (message.text) {
      const urls = extractValidUrlsFromText(message.text)

      if (urls.length > 0) {
        await ctx.scheduler.runAfter(0, internal.action.evaluateMessageUrls.run, {
          urls: urls.map((url) => url.toString()),
          ownerId: message.userId,
        })
      }
    }
  }

  if (generateThreadTitle && !thread.title) {
    await ctx.scheduler.runAfter(0, internal.action.generateThreadTitle.run, {
      messageId: message._id,
    })
  }

  return message
}
