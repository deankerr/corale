'use client'

import { isCompleteHTML, processHTML, wrapBodyInHTMLWithCSP } from '@/lib/html-parsing'
import { useEffect, useRef } from 'react'

function processHTMLText(htmlText: string) {
  if (!isCompleteHTML(htmlText)) return null

  const { metadata, body } = processHTML(htmlText)
  const srcdoc = wrapBodyInHTMLWithCSP(body)

  return { metadata, srcdoc }
}

export const HTMLRenderer = ({ htmlText }: { htmlText: string }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { srcdoc } = processHTMLText(htmlText) ?? {}

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    iframe.srcdoc = srcdoc ?? wrapBodyInHTMLWithCSP('Invalid HTML')

    return () => {
      iframe.srcdoc = ''
    }
  }, [srcdoc])

  return (
    <iframe
      ref={iframeRef}
      title="Rendered HTML Content"
      sandbox="allow-scripts"
      referrerPolicy="no-referrer"
      loading="lazy"
      className="h-full w-full"
      tabIndex={0}
      aria-label="Rendered HTML content"
    />
  )
}
