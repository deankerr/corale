'use client'

import { createHTMLDocument, createHTMLRendererString, isCompleteHTML } from '@corale/shared/parsing/html'
import { useEffect, useRef } from 'react'
import { CalloutErrorBasic } from '../ui/Callouts'

export type IFrameInternalError = {
  name: string
  message: string
  source?: string
  lineno?: number
  colno?: number
  stack?: string
}

function processHTMLText(htmlText: string) {
  if (!isCompleteHTML(htmlText)) return

  const doc = createHTMLDocument(htmlText)

  // move script/style tags to body
  const headElements = Array.from(doc.head.children)
  headElements.filter((el) => el.tagName === 'SCRIPT' || el.tagName === 'STYLE').forEach((el) => doc.body.prepend(el))

  const body = doc.body.innerHTML
  return createHTMLRendererString(body)
}

export const HTMLRenderer = ({
  htmlText,
  onIFrameInternalError,
}: {
  htmlText: string
  onIFrameInternalError?: (error: IFrameInternalError) => void
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const processedHTMLText = processHTMLText(htmlText)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe || !processedHTMLText) return

    iframe.srcdoc = processedHTMLText

    const handleMessage = (event: MessageEvent) => {
      if ((event.data.type === 'iframe-error' || event.data.type === 'iframe-promise-error') && onIFrameInternalError) {
        onIFrameInternalError(event.data.error)
      }
    }
    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
      iframe.srcdoc = ''
    }
  }, [processedHTMLText, onIFrameInternalError])

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
