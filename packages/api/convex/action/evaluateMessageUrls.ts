import { v } from 'convex/values'
import fastContentTypeParse from 'fast-content-type-parse'
import { nanoid } from 'nanoid/non-secure'
import { internal } from '../_generated/api'
import { internalAction } from '../functions'
import { fetch } from '../lib/fetch'

export const run = internalAction({
  args: {
    urls: v.array(v.string()),
    ownerId: v.id('users'),
  },
  handler: async (ctx, args): Promise<void> => {
    const urlData = await Promise.all(args.urls.map(fetchContentTypeData))

    const imageUrls = urlData.filter((data) => data.type.startsWith('image')).map((data) => data.url)

    if (imageUrls.length === 0) return

    const runId = nanoid()

    for (const url of imageUrls) {
      await ctx.scheduler.runAfter(0, internal.action.ingestImageUrl.runV2, {
        sourceUrl: url,
        sourceType: 'message-url',
        ownerId: args.ownerId,
        runId,
      })
    }
  },
})

async function fetchContentTypeData(url: URL | string) {
  try {
    const response = await fetch.head(url.toString())

    const contentLength = parseInt(response.headers.get('content-length') || '0', 10)
    if (contentLength > 10 * 1024 * 1024) {
      // 10 MB limit
      throw new Error('Response too large')
    }

    const contentTypeHeader = response.headers.get('content-type')
    const { type, parameters } = fastContentTypeParse.parse(contentTypeHeader || '')
    return {
      url: url.toString(),
      type,
      parameters,
    }
  } catch (error) {
    console.error(`Error fetching content info for ${url.toString()}:`, error)
    return {
      url: url.toString(),
      type: 'unknown',
      parameters: {},
    }
  }
}
