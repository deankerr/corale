import type { Artifact } from '@/app/(preview)/artifacts/components/atoms'

export type CodeBlockInfo = {
  content: string
  language?: string
  metadata: string[]
  title?: string
}

/**
 * Extracts title from HTML or SVG content
 * Returns undefined if none found
 */
export function extractTitle(content: string): string | undefined {
  const titleMatch = content.match(/<title[^>]*>(.*?)<\/title>/i)
  return titleMatch?.[1]?.trim()
}

/**
 * Creates an artifact object from code block content
 */
export function createArtifact(type: 'svg' | 'html', content: string): Artifact {
  return {
    type,
    content,
    title: extractTitle(content) ?? 'Untitled',
    version: 'v1',
  }
}

/**
 * Extracts all code blocks from a markdown text
 * Returns array of code block information including content, language, metadata and title
 */
export function extractCodeBlocks(markdownText: string): CodeBlockInfo[] {
  const codeBlockRegex = /```(.*?)\n([\s\S]*?)```/g
  const blocks: CodeBlockInfo[] = []

  let match
  while ((match = codeBlockRegex.exec(markdownText)) !== null) {
    // Ensure we have all required groups
    if (match.length < 3) continue

    const [_, firstLine = '', content = ''] = match

    // Split the first line into language and metadata
    const parts = firstLine.trim().split(/\s+/)
    const language = parts[0] || undefined
    const metadata = parts.slice(1)

    // Only try to extract title if we have valid content and appropriate language
    const title = language && ['html', 'svg'].includes(language) ? extractTitle(content) : undefined

    blocks.push({
      content: content.trim(),
      language,
      metadata,
      title,
    })
  }

  return blocks
}

/**
 * Extracts text content from a markdown code block node
 */
function extractCodeBlockTextFromNode(node: any): string {
  const textNode = node?.children?.[0]?.children?.[0]
  return textNode?.value || ''
}

/**
 * Extracts a single code block's information from a node
 */
export function extractCodeBlockInfoFromNode(node: any): CodeBlockInfo {
  const codeNode = node?.children[0] as { properties?: { className?: string[] } }
  const content = extractCodeBlockTextFromNode(node)
  const languageClass = codeNode?.properties?.className?.[0]
  const language = languageClass ? languageClass.replace('language-', '') : undefined

  // Only try to extract title if we have appropriate language
  const title = language && ['html', 'svg'].includes(language) ? extractTitle(content) : undefined

  return {
    content,
    language,
    metadata: [],
    title,
  }
}
