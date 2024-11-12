'use client'

import { CalloutErrorBasic } from '@/components/ui/Callouts'
import DOMPurify from 'dompurify'
import { useEffect, useState } from 'react'

export const SVGRenderer = ({ svgText, sanitize = true }: { svgText: string; sanitize?: boolean }) => {
  const [blobUrl, setBlobUrl] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setError(null)

    let url: string | null = null

    try {
      const processedSVG = sanitize ? sanitizeSVGString(svgText) : svgText

      const blob = new Blob([processedSVG], { type: 'image/svg+xml' })
      url = URL.createObjectURL(blob)
      setBlobUrl(url)
    } catch (error) {
      console.error('Error processing SVG:', error)
      setError('An error occurred while attempting to process the SVG content.')
      return
    }

    return () => {
      if (url) {
        URL.revokeObjectURL(url)
        setBlobUrl('')
      }
    }
  }, [svgText, sanitize])

  if (error) {
    return <CalloutErrorBasic>{error}</CalloutErrorBasic>
  }

  if (!blobUrl) {
    return <div className="bg-gray-3 h-32 w-48 animate-pulse" />
  }

  return (
    <div className="overflow-hidden p-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={blobUrl}
        className="h-auto max-h-[90vh] w-full select-none object-contain"
        alt="SVG content"
        role="img"
        onError={() => setError('An error occurred while attempting to render the SVG.')}
      />
    </div>
  )
}

function sanitizeSVGString(svgString: string) {
  const options = {
    USE_PROFILES: { svg: true, svgFilters: true },
    ADD_TAGS: ['animate', 'use'],
    ADD_ATTR: ['to', 'from', 'dominant-baseline'],
  }

  return DOMPurify.sanitize(svgString, options)
}
