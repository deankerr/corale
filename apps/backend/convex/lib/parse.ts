import { ENV } from './env'

type MarkdownBlock =
  | {
      type: 'text'
      content: string
    }
  | {
      type: 'codeblock'
      content: string
      language: string
    }

export function parseMarkdownCodeBlocks(markdown: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = []
  const regex = /```(\w*)\n([\s\S]*?)```|([^]+?(?=```|$))/g
  let match

  while ((match = regex.exec(markdown)) !== null) {
    if (match[3]) {
      blocks.push({
        type: 'text',
        content: match[3].trim(),
      })
    } else {
      blocks.push({
        type: 'codeblock',
        language: match[1] || 'plaintext',
        content: (match[2] ?? '').trim(),
      })
    }
  }

  return blocks
}

export function parseURLs(text: string): URL[] {
  const urlRegex = /https?:\/\/[^\s]+/g
  const matches = text.match(urlRegex)

  if (!matches) {
    return []
  }

  const urls: URL[] = []

  for (const match of matches) {
    try {
      const url = new URL(match)
      urls.push(url)
    } catch (error) {
      // Invalid URL
    }
  }

  return urls
}

export function isLikeIPAddress(url: URL | string): boolean {
  const hostname = typeof url === 'string' ? url : url.hostname

  const isLikeIPV4 = hostname.split('.').every((part) => !isNaN(Number(part)))
  const isLikeIPV6 = hostname.includes(':') || hostname.includes('[')

  return isLikeIPV4 || isLikeIPV6
}

export function parseURLsFromText(text: string) {
  return parseMarkdownCodeBlocks(text)
    .filter((block) => block.type === 'text')
    .flatMap((block) => parseURLs(block.content))
    .filter((url) => !isLikeIPAddress(url) && url.hostname !== ENV.APP_HOSTNAME)
}
