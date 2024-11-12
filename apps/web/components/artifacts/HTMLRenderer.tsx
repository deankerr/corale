'use client'

import { createHTMLDocument, isCompleteHTML, wrapHTMLBodyContent } from '@corale/shared/parsing/html'
import { useEffect, useRef } from 'react'
import { CalloutErrorBasic } from '../ui/Callouts'

function processHTMLText(htmlText: string) {
  if (!isCompleteHTML(htmlText)) return

  const doc = createHTMLDocument(htmlText)

  // Move head elements to body
  const headElements = Array.from(doc.head.children)
  headElements.filter((el) => el.tagName === 'SCRIPT' || el.tagName === 'STYLE').forEach((el) => doc.body.prepend(el))

  const body = doc.body.innerHTML
  return wrapHTMLBodyContent(body)
}

export const HTMLRenderer = ({ htmlText }: { htmlText: string }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const processedHTMLText = processHTMLText(htmlText)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe || !processedHTMLText) return

    iframe.srcdoc = processedHTMLText

    return () => {
      iframe.srcdoc = ''
    }
  }, [processedHTMLText])

  if (!processedHTMLText) {
    return <CalloutErrorBasic>Invalid HTML structure.</CalloutErrorBasic>
  }

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
