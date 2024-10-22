import { internal } from '../_generated/api'
import { isLikeIPAddress, parseMarkdownCodeBlocks, parseURLs } from '../../parse'
import { ENV } from '../lib/env'
import type { Ent, MutationCtx } from '../types'

export async function threadPostRun(ctx: MutationCtx, thread: Ent<'threads'>) {
  if (thread.title) return
  await ctx.scheduler.runAfter(1000, internal.action.generateThreadTitle.run, {
    threadId: thread._id,
  })
}

export async function messagePostCreate(ctx: MutationCtx, message: Ent<'messages'>) {
  if (!message.text || message.role !== 'user') return

  const urls = parseMarkdownCodeBlocks(message.text)
    .filter((block) => block.type === 'text')
    .flatMap((block) => parseURLs(block.content))
    .filter((url) => !isLikeIPAddress(url) && url.hostname !== ENV.APP_HOSTNAME)

  if (urls.length > 0) {
    await ctx.scheduler.runAfter(0, internal.action.evaluateMessageUrls.run, {
      urls: urls.map((url) => url.toString()),
      ownerId: message.userId,
    })
  }
}
