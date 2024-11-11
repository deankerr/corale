type HTMLMetadata = {
  title?: string
  description?: string
  charset?: string
  viewport?: string
  styles: string[]
  scripts: string[]
  links: Array<{
    rel: string
    href: string
  }>
}

type ProcessedHTML = {
  metadata: HTMLMetadata
  body: string
}

/**
 * Creates an in-memory DOM from HTML string
 */
function createDocumentFromString(htmlString: string) {
  const parser = new DOMParser()
  return parser.parseFromString(htmlString, 'text/html')
}

/**
 * Extracts metadata from document head
 */
function extractMetadata(doc: Document): HTMLMetadata {
  return {
    title: doc.title,
    description: doc.querySelector('meta[name="description"]')?.getAttribute('content') ?? undefined,
    charset: doc.querySelector('meta[charset]')?.getAttribute('charset') ?? undefined,
    viewport: doc.querySelector('meta[name="viewport"]')?.getAttribute('content') ?? undefined,
    styles: Array.from(doc.querySelectorAll('style, link[rel="stylesheet"]')).map((el) => el.outerHTML),
    scripts: Array.from(doc.querySelectorAll('script')).map((el) => el.outerHTML),
    links: Array.from(doc.querySelectorAll('link')).map((el) => ({
      rel: el.getAttribute('rel') ?? '',
      href: el.getAttribute('href') ?? '',
    })),
  }
}

/**
 * Moves head elements (scripts, styles) to body
 */
function moveHeadElementsToBody(doc: Document) {
  const headElements = Array.from(doc.head.children)
  headElements.filter((el) => el.tagName === 'SCRIPT' || el.tagName === 'STYLE').forEach((el) => doc.body.prepend(el))
}

/**
 * Gets sanitized body content
 */
function getBodyContent(doc: Document): string {
  return doc.body.innerHTML
}

/**
 * Processes HTML string and returns metadata and prepared content
 */
export function processHTML(htmlString: string): ProcessedHTML {
  const doc = createDocumentFromString(htmlString)
  const metadata = extractMetadata(doc)

  moveHeadElementsToBody(doc)
  const body = getBodyContent(doc)

  return { metadata, body }
}

/**
 * Validates if string is likely a complete HTML document
 */
export function isCompleteHTML(htmlString: string): boolean {
  return htmlString.includes('<!DOCTYPE html>') && htmlString.includes('<html') && htmlString.includes('</html>')
}

/**
 * Creates a complete HTML document from partial HTML
 */
export function wrapBodyInHTMLWithCSP(partialHTML: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="${iframeCSPContent}">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="referrer" content="no-referrer">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="x-dns-prefetch-control" content="off">
        <meta name="format-detection" content="telephone=no">
        <meta http-equiv="Cache-Control" content="no-store">
        <script>
          setTimeout(() => {
            window.stop();
          }, 5000);
        </script>
      </head>
      <body>${partialHTML}</body>
    </html>
  `
}

export const iframeCSPContent = `
default-src 'self';

script-src 
    'self' 
    https://cdnjs.cloudflare.com 
    https://cdn.jsdelivr.net 
    https://unpkg.com 
    'unsafe-inline';

style-src 
    'self' 
    https://cdnjs.cloudflare.com 
    https://fonts.googleapis.com 
    'unsafe-inline';

img-src 
    'self' 
    https:;

font-src 
    'self' 
    https://fonts.gstatic.com;

connect-src 
    'none';

frame-src 
    'none';

object-src 
    'none';

worker-src 
    'none';

base-uri 
    'self';

form-action 
    'self';

upgrade-insecure-requests;`
