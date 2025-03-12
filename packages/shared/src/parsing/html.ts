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

/**
 * Creates an in-memory DOM from HTML string
 */
export function createHTMLDocument(input: string) {
  const parser = new DOMParser()
  return parser.parseFromString(input, 'text/html')
}

/**
 * Extracts metadata from document head
 */
export function extractHTMLDocumentMetadata(doc: Document) {
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
 * Creates a complete HTML document from partial HTML with optional error tracking
 */
export function createHTMLRendererString(body: string): string {
  const iframeHTMLCSPContent = `default-src 'self'; 
script-src 'self' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://unpkg.com 'unsafe-inline'; 
style-src 'self' https://cdnjs.cloudflare.com https://fonts.googleapis.com 'unsafe-inline'; 
img-src 'self' https:; 
font-src 'self' https://fonts.gstatic.com; 
connect-src 'self' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://unpkg.com; 
media-src 'self' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://unpkg.com; 
frame-src 'none'; 
object-src 'none'; 
worker-src 'none'; 
base-uri 'self'; 
form-action 'self'; 
upgrade-insecure-requests;`

  const errorTrackingScript = `
    <script>
      window.onerror = function(message, source, lineno, colno, error) {
        window.parent.postMessage({
          type: 'iframe-error',
          error: {
            name: error?.name || 'Error',
            message,
            source,
            lineno,
            colno,
            stack: error?.stack
          }
        }, '*');
        return false;
      };

      window.addEventListener('unhandledrejection', function(event) {
        const error = event.reason;
        window.parent.postMessage({
          type: 'iframe-promise-error',
          error: {
            name: error?.name || 'UnhandledPromiseRejection',
            message: event.reason?.message || event.reason,
            stack: event.reason?.stack
          }
        }, '*');
      });
    </script>
  `

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="${iframeHTMLCSPContent}">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="referrer" content="no-referrer">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="x-dns-prefetch-control" content="off">
        <meta name="format-detection" content="telephone=no">
        <meta http-equiv="Cache-Control" content="no-store">
        ${errorTrackingScript}
        <script>
          setTimeout(() => {
            window.stop();
          }, 5000);
        </script>
      </head>
      <body>${body}</body>
    </html>
  `.trim()
}
