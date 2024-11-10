import type { Artifact } from '@/app/(preview)/artifacts/components/atoms'

/**
 * Extracts text content from a markdown code block node
 */
export function extractCodeBlockText(node: any): string {
  const textNode = node?.children?.[0]?.children?.[0]
  return textNode?.value || ''
}

/**
 * Extracts title from HTML or SVG content
 * Returns default title if none found
 */
export function extractTitle(content: string, defaultTitle = 'Untitled'): string {
  const titleMatch = content.match(/<title[^>]*>(.*?)<\/title>/i)
  return titleMatch?.[1]?.trim() || defaultTitle
}

/**
 * Creates an artifact object from code block content
 */
export function createArtifact(type: 'svg' | 'html', content: string): Artifact {
  return {
    type,
    content,
    title: extractTitle(content),
    version: 'v1',
  }
}
