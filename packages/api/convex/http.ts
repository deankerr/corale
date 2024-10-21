import { httpRouter } from 'convex/server'
import { serve, serveUrl } from './db/images'
import { handleWebhook } from './lib/clerk'

const http = httpRouter()

http.route({
  path: '/clerk',
  method: 'POST',
  handler: handleWebhook,
})

http.route({ pathPrefix: '/i/', method: 'GET', handler: serve })
http.route({ pathPrefix: '/image-url/', method: 'GET', handler: serveUrl })

export default http
