export type CodeBlock = {
  content: string
  language?: string
  metadata: string[]
}

/**
 * Parses markdown code blocks to extract content, language and metadata
 *
 * Handles formats like:
 * ```language arg1 arg2
 * code content
 * ```
 */
export function parseCodeBlocks(markdown: string): CodeBlock[] {
  // Match code blocks including the opening line
  const codeBlockRegex = /```(.*?)\n([\s\S]*?)```/g
  const blocks: CodeBlock[] = []

  let match
  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    // Skip if we don't have the expected capture groups
    if (match.length < 3) continue

    const [_, firstLine = '', content = ''] = match

    // Parse the first line into language and metadata
    const parts = firstLine.trim().split(/\s+/)
    const language = parts[0] || undefined
    const metadata = parts.slice(1)

    blocks.push({
      content: content.trim(),
      language,
      metadata,
    })
  }

  return blocks
}

/**
 * Extracts code block info from a markdown AST node
 */
export function parseCodeBlockFromNode(node: any): CodeBlock {
  // Get the code content
  const content = node?.children?.[0]?.children?.[0]?.value?.trim() ?? ''

  // Extract language from className (e.g. "language-typescript")
  const languageClass = node?.children?.[0]?.properties?.className?.[0]
  const language = languageClass ? languageClass.replace('language-', '') : undefined

  return {
    content,
    language,
    metadata: [], // AST nodes don't typically contain metadata
  }
}
