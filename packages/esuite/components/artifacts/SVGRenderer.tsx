'use client'

import DOMPurify from 'dompurify'
import { useEffect, useRef } from 'react'

export const SVGRenderer = ({ svgText, sanitize = true }: { svgText: string; sanitize?: boolean }) => {
  const svgContainerRef = useRef<HTMLDivElement>(null)

  const options = {
    USE_PROFILES: { svg: true, svgFilters: true },
    ADD_TAGS: ['animate', 'use'],
    ADD_ATTR: ['to', 'from', 'dominant-baseline'],
  }

  const processedSVG = DOMPurify.sanitize(svgText, options)

  const renderString = processedSVG ? (sanitize ? processedSVG : svgText) : 'Invalid SVG'

  useEffect(() => {
    const container = svgContainerRef.current
    if (!container) return

    container.innerHTML = renderString
  }, [renderString])

  return <div ref={svgContainerRef} tabIndex={0} aria-label="Rendered SVG content" role="img" />
}
