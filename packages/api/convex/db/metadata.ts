import { v } from 'convex/values'
import { getQuery } from 'ufo'

import { api } from '../_generated/api'
import { httpAction } from '../_generated/server'
import { query } from '../functions'
import { getThread } from './helpers/threads'

export const getMetadata = query({
  args: {
    route: v.string(),
    id: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.route === 'chats') {
      const thread = await getThread(ctx, args.id)
      if (thread && thread.title) {
        return {
          title: thread.title,
        }
      }
    }

    return null
  },
})

export const serveMetadata = httpAction(async (ctx, request) => {
  // convex.site/metadata?route=chats&id=123
  const query = getQuery(request.url)
  const route = Array.isArray(query.route) ? query.route[0] : query.route
  const id = Array.isArray(query.id) ? query.id[0] : query.id

  if (!route || !id) return Response.json({ error: 'Invalid route' }, { status: 400 })

  const result = await ctx.runQuery(api.db.metadata.getMetadata, { route, id })
  if (!result) return Response.json({ error: 'Not found' }, { status: 404 })

  return Response.json(result)
})
