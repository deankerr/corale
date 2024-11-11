'use client'

import DOMPurify from 'dompurify'
import { useEffect, useState } from 'react'

export const SVGRenderer = ({ svgText, sanitize = true }: { svgText: string; sanitize?: boolean }) => {
  const [blobUrl, setBlobUrl] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setError(null)

    try {
      const processedSVG = sanitize ? sanitizeSVGString(svgText) : svgText

      const blob = new Blob([processedSVG], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      setBlobUrl(url)

      return () => {
        URL.revokeObjectURL(url)
        setBlobUrl('')
      }
    } catch (error) {
      console.error('Error processing SVG:', error)
      setError('Failed to process SVG content')
      return
    }
  }, [svgText, sanitize])

  if (error) {
    return (
      <div className="flex h-32 items-center justify-center rounded border p-4 text-sm">
        <p>{error}</p>
      </div>
    )
  }

  if (!blobUrl) {
    return <div className="bg-gray-3 h-32 w-48 animate-pulse" />
  }

  return (
    <div className="overflow-hidden p-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={blobUrl}
        className="h-auto max-h-[90vh] w-full object-contain"
        alt="SVG content"
        role="img"
        onError={() => setError('Failed to load SVG')}
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
