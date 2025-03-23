import { parseCodeBlocks } from '@corale/shared/parsing/code'
import { parseSVG } from '@corale/shared/parsing/svg'
import { api } from '~/_generated/api'
import { httpAction } from '~/_generated/server'
import { parseFilename } from 'ufo'

export const serveSvg = httpAction(async (ctx, request) => {
  const messageId = parseUrlToMessageId(request.url)

  const result = messageId
    ? await ctx.runQuery(api.entities.threads.messages.get, {
        messageId,
      })
    : null

  if (!result || !result.text) {
    return new Response('SVG content not found', {
      status: 404,
    })
  }

  const codeBlocks = parseCodeBlocks(result.text)
  const svgBlock = codeBlocks.find((block) => block.language === 'svg')

  if (!svgBlock) {
    return new Response('SVG content not found', {
      status: 404,
    })
  }

  const svg = parseSVG(svgBlock.content)

  if (!svg.success) {
    console.error(svg.error)
    return new Response('Invalid SVG content', {
      status: 400,
    })
  }

  // Get the byte length of the SVG content
  const encoder = new TextEncoder()
  const contentLength = encoder.encode(svg.data.svg).length

  // Set common headers
  const headers = new Headers({
    'Content-Type': 'image/svg+xml',
    'Content-Length': contentLength.toString(),
  })

  return new Response(svg.data.svg, { headers })
})

function parseUrlToMessageId(url: string): string | null {
  const filename = parseFilename(url, { strict: false })
  return filename ? (filename.split('.')[0] ?? null) : null
}
