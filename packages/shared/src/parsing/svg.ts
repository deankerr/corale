// Types for a zod-style result without the zod dependency
export type SVGParseResult =
  | {
      success: true
      data: {
        svg: string
        viewBox?: string
        width?: string
        height?: string
        wasSanitized?: boolean
      }
    }
  | {
      success: false
      error: {
        message: string
      }
    }

// XML utility functions

/**
 * Extracts a complete tag including its opening tag, content, and closing tag
 * Returns the entire tag or null if not found
 */
export function extractElement(content: string, tagName: string): string | null {
  // The regex needs to handle:
  // 1. The opening tag with possible attributes
  // 2. All content between tags (potentially with nested elements)
  // 3. The closing tag
  const tagPattern = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)</${tagName}>`, 'i')
  const match = content.match(tagPattern)

  if (!match) return null

  return match[0]
}

/**
 * Extracts all attributes from a tag
 */
function extractAllAttributes(tag: string): Record<string, string> {
  const attributes: Record<string, string> = {}
  const regex = /(\w+)=["']([^"']*)["']/g

  let match: RegExpExecArray | null
  while ((match = regex.exec(tag)) !== null) {
    if (match[1]) {
      attributes[match[1]] = match[2] || ''
    }
  }

  return attributes
}

/**
 * Escapes unescaped ampersands in XML/SVG content
 * Preserves existing XML entities like &lt;, &gt;, &amp;, etc.
 */
function escapeAmpersands(content: string): string {
  // This regex matches standalone ampersands that aren't part of an entity
  // It uses negative lookahead to avoid matching entity references
  // Supports:
  // - Named entities (&lt;, &gt;, &amp;, etc.)
  // - Decimal entities (&#123;)
  // - Hexadecimal entities (&#x1A2B;)
  // Entity names can have letters, digits, periods, hyphens, and underscores
  return content.replace(/&(?![a-z0-9._-]+;|#[0-9]+;|#x[0-9a-f]+;)/gi, '&amp;')
}

/**
 * Sanitizes an SVG by removing potentially harmful elements and attributes
 * This helps prevent XSS attacks when embedding SVGs
 */
function sanitizeSVG(svg: string): { sanitized: string; wasSanitized: boolean } {
  const original = svg
  let sanitized = svg

  // Remove script tags and their content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

  // Remove event handlers
  const eventHandlers = [
    'onload',
    'onclick',
    'onmouseover',
    'onmouseout',
    'onmousemove',
    'onmousedown',
    'onmouseup',
    'ondblclick',
    'onfocus',
    'onblur',
    'onerror',
  ]

  eventHandlers.forEach((handler) => {
    const regex = new RegExp(`\\s${handler}=["'][^"']*["']`, 'gi')
    sanitized = sanitized.replace(regex, '')
  })

  // Find and clean href attributes with javascript: URLs (multi-line included)
  // First, find all href/xlink:href/src attributes
  const findHrefRegex = /(href|xlink:href|src)=["']([\s\S]*?)["']/gi
  const hrefMatches: Array<{ full: string; attr: string; value: string }> = []

  let hrefMatch: RegExpExecArray | null
  while ((hrefMatch = findHrefRegex.exec(sanitized)) !== null) {
    if (
      hrefMatch[2] &&
      (hrefMatch[2].includes('javascript:') ||
        (hrefMatch[2].includes('data:') && !hrefMatch[2].includes('data:image/')))
    ) {
      hrefMatches.push({
        full: hrefMatch[0],
        attr: hrefMatch[1] || '',
        value: hrefMatch[2] || '',
      })
    }
  }

  // Replace each dangerous href with a safe one
  hrefMatches.forEach((match) => {
    sanitized = sanitized.replace(match.full, `${match.attr}="about:blank"`)
  })

  // Remove use elements with external URLs which can load remote content
  // Only remove use elements with external URLs (not starting with #)
  // Also ensure we don't break valid internal references
  sanitized = sanitized.replace(
    /<use\s+[^>]*xlink:href=["'](?!#)([^"']*(?:https?:|\/\/)[^"']*)["'][^>]*>/gi,
    '<use xlink:href="about:blank">',
  )

  // Only sanitize external URLs in url() references, preserving internal references
  sanitized = sanitized.replace(/url\(\s*["']?(?!#)([^)]*(?:https?:|\/\/)[^)]*)["']?\s*\)/gi, 'url(#removed)')

  // Clean up any remaining potential XSS vectors
  const xssPatterns = [
    /alert\s*\(/gi,
    /javascript:/gi,
    /eval\s*\(/gi,
    /fetch\s*\(/gi,
    /document\.cookie/gi,
    /localStorage/gi,
  ]

  xssPatterns.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, '')
  })

  // After sanitization, escape any unescaped ampersands
  sanitized = escapeAmpersands(sanitized)

  return {
    sanitized,
    wasSanitized: sanitized !== original,
  }
}

/**
 * Extracts an SVG element from text content
 * Used to find the SVG tag in a larger chunk of text
 */
export function extractSVG(content: string): string | null {
  return extractElement(content, 'svg')
}

/**
 * Parses and validates an SVG string, correcting common errors
 * Returns a zod-style result object with success/error information
 *
 * When successful, the result includes:
 * - svg: The sanitized SVG string
 * - viewBox, width, height: Any size attributes found in the SVG
 * - wasSanitized: Boolean flag indicating if any potentially harmful content was removed
 *   This is useful for marking SVGs that may need manual review
 */
export function parseSVG(content: string): SVGParseResult {
  // First, try to extract the SVG tag from the content
  const extractedSvg = extractSVG(content)

  if (!extractedSvg) {
    // Check if either opening or closing tag is present, but not both
    const hasOpeningTag = content.match(/<svg[^>]*>/i) !== null
    const hasClosingTag = content.match(/<\/svg>/i) !== null

    if (hasOpeningTag || hasClosingTag) {
      return {
        success: false,
        error: {
          message: 'Incomplete SVG',
        },
      }
    }

    return {
      success: false,
      error: {
        message: 'No SVG found in content',
      },
    }
  }

  // Extract SVG information from the opening tag
  const svgOpenTagMatch = extractedSvg.match(/<svg[^>]*>/i)
  if (!svgOpenTagMatch) {
    return {
      success: false,
      error: {
        message: 'Failed to parse SVG opening tag',
      },
    }
  }

  // Get size attributes from the opening tag
  const svgOpenTag = svgOpenTagMatch[0]
  const attributes = extractAllAttributes(svgOpenTag)

  // Sanitize the SVG to remove potentially harmful content
  const { sanitized: svgContent, wasSanitized } = sanitizeSVG(extractedSvg)

  return {
    success: true,
    data: {
      svg: svgContent,
      viewBox: attributes.viewBox,
      width: attributes.width,
      height: attributes.height,
      wasSanitized,
    },
  }
}
