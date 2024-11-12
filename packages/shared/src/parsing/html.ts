/**
 * Checks if content appears to be a complete HTML document
 */
export function isCompleteHTML(content: string): boolean {
  const normalized = content.replace(/<!--[\s\S]*?-->/g, '') // Remove comments
  return normalized.includes('<html') && normalized.includes('</html>')
}

/**
 * Checks if content appears to be a complete SVG document
 */
export function isCompleteSVG(content: string): boolean {
  const normalized = content.replace(/<!--[\s\S]*?-->/g, '') // Remove comments
  return normalized.includes('<svg') && normalized.includes('</svg>')
}

/**
 * Determines if content is a complete document that can be previewed directly
 */
export function isCompleteDocument(content: string, language?: string): boolean {
  if (!content || !language) return false

  if (language === 'html') return isCompleteHTML(content)
  if (language === 'svg') return isCompleteSVG(content)

  return false
}

/**
 * Extracts value from HTML or SVG title tags
 */
export function extractHTMLTitleValue(input: string): string | undefined {
  const titleMatch = input.match(/<title[^>]*>(.*?)<\/title>/i)
  return titleMatch?.[1]?.trim()
}
