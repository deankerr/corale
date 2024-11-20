'use client'

import { SkeletonPulse } from '@/components/ui/Skeleton'
import { useDebouncedValue } from '@/lib/useDebouncedValue'
import { useCallback, useEffect, useId, useRef, useState } from 'react'

export default function MermaidRenderer({ content }: { content: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const uniqueId = useId().replace(/:/g, '')

  // Use a shorter debounce for partial diagrams
  const debouncedContent = useDebouncedValue(content, 500)

  const renderDiagram = useCallback(async () => {
    if (!containerRef.current) return

    try {
      const mermaid = (await import('mermaid')).default

      // Initialize with more permissive config
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'strict',
        suppressErrorRendering: true,
        flowchart: {
          curve: 'basis',
          padding: 20,
          nodeSpacing: 50,
          rankSpacing: 50,
          useMaxWidth: true,
        },
        sequence: {
          useMaxWidth: true,
        },
        gantt: {
          useMaxWidth: true,
        },
        er: {
          useMaxWidth: true,
        },
      })

      // Attempt to parse with error suppression
      try {
        await mermaid.parse(debouncedContent, { suppressErrors: true })
      } catch {
        // If parse fails but content looks like it might be a partial diagram, continue
        if (!debouncedContent.includes('```') && !debouncedContent.trim().endsWith(';')) {
          return // Wait for more complete content
        }
      }

      // Clear previous render
      containerRef.current.innerHTML = ''

      // Attempt render with unique key
      const { svg } = await mermaid.render(`mermaid-${uniqueId}-${Date.now()}`, debouncedContent)

      if (containerRef.current) {
        containerRef.current.innerHTML = svg

        // Add centering and sizing styles to the SVG element
        const svgElement = containerRef.current.querySelector('svg')
        if (svgElement) {
          svgElement.style.display = 'block'
          svgElement.style.margin = '0 auto'
          
          // Set max dimensions while preserving aspect ratio
          svgElement.style.maxWidth = '100%'
          svgElement.style.maxHeight = '800px' // Cap maximum height
          svgElement.style.width = 'auto'
          svgElement.style.height = 'auto'

          // Ensure the viewBox is set for proper scaling
          if (!svgElement.getAttribute('viewBox')) {
            const width = svgElement.getAttribute('width')
            const height = svgElement.getAttribute('height')
            if (width && height) {
              svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`)
            }
          }
        }

        setIsLoading(false)
      }
    } catch (error) {
      // Log error but keep loading state if content appears incomplete
      console.warn('Mermaid render attempted:', error)

      // If content ends with a typical diagram terminator, show error state
      if (debouncedContent.trim().endsWith(';')) {
        setIsLoading(false)
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div class="p-4">Unable to render diagram</div>`
        }
      }
    }
  }, [debouncedContent, uniqueId])

  useEffect(() => {
    setIsLoading(true)
    renderDiagram()
  }, [renderDiagram])

  return (
    <div className="my-4 flex justify-center">
      {isLoading && <SkeletonPulse className="h-[600px] w-full" />}
      <div
        ref={containerRef}
        className={isLoading ? 'hidden' : 'block w-full text-center'}
        key={`mermaid-${uniqueId}-${debouncedContent.length}`}
      />
    </div>
  )
}
