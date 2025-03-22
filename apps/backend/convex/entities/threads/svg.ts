import { parseCodeBlocks } from '@corale/shared/parsing/code'
import { api } from '~/_generated/api'
import { parseFilename } from 'ufo'
import { httpAction } from '../../_generated/server'

export const serveSvg = httpAction(async (ctx, request) => {
  const messageId = parseUrlToMessageId(request.url)

  if (!messageId) {
    return new Response('Not Found', { status: 404 })
  }

  const message = await ctx.runQuery(api.entities.threads.messages.get, {
    messageId,
  })

  if (!message || !message.text) {
    return new Response('Not Found', { status: 404 })
  }

  const svgContent = extractSvgContent(message.text)

  if (!svgContent) {
    return new Response('No SVG content found in message', { status: 404 })
  }

  return new Response(svgContent, {
    headers: {
      'Content-Type': 'image/svg+xml',
    },
  })
})

function parseUrlToMessageId(url: string): string | null {
  const filename = parseFilename(url, { strict: false })
  return filename ? filename.split('.')[0] : null
}

function extractSvgContent(text: string): string | null {
  const codeBlocks = parseCodeBlocks(text)

  for (const block of codeBlocks) {
    if (block.language === 'svg') {
      return block.content
    }
  }

  return null
}
