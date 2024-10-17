'use client'

import { useEffect, useRef } from 'react'

export const HTMLRenderer = ({ htmlText }: { htmlText: string }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const processedHtml = htmlText

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const csp = `default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src 'self';`
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta http-equiv="Content-Security-Policy" content="${csp}">
        </head>
        <body>${processedHtml}</body>
      </html>
    `

    iframe.srcdoc = htmlContent
  }, [processedHtml])

  return (
    <iframe
      ref={iframeRef}
      title="Rendered HTML Content"
      sandbox="allow-scripts"
      className="h-full w-full"
      tabIndex={0}
      aria-label="Rendered HTML content"
    />
  )
}
