import { ENV } from './env'

export function parseJson(input: string): unknown {
  try {
    return JSON.parse(input)
  } catch (error) {
    console.error('Unable to parse JSON', input, error)
    return undefined
  }
}

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

type TemplateReplacer = {
  tag: string
  value: string | (() => string)
}

export function replaceTemplateTags(template = '', replacers: TemplateReplacer[]): string {
  let result = template

  for (const { tag, value } of replacers) {
    // matches {{tag}} but not \{{tag}}
    const regex = new RegExp(`(?<!\\\\)\\{\\{${tag}\\}\\}`, 'g')

    const replacement = typeof value === 'function' ? value() : value
    result = result.replace(regex, replacement)
  }

  // remove backslash from escaped tags
  return result.replace(/\\(\{\{.*?\}\})/g, '$1')
}

export function truncateText(text = '', maxLength: number) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

export function hasDelimiter(text: string) {
  return text.includes('\n') || text.includes('.') || text.includes('?') || text.includes('!')
}

export function extractHTMLTitle(content: string): string | undefined {
  const titleMatch = content.match(/<title[^>]*>(.*?)<\/title>/i)
  return titleMatch?.[1]?.trim()
}
