'use client'

import { SkeletonPulse } from '@/components/ui/Skeleton'
import { useEffect, useId, useRef, useState } from 'react'

function estimateDiagramHeight(content: string): number {
  const lines = content.split('\n').filter((line) => line.trim().length > 0)
  const nodeCount = lines.filter((line) => line.includes('->') || line.includes('--')).length
  return Math.max(800, nodeCount * 40)
}

export default function MermaidRenderer({ content }: { content: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const uniqueId = useId().replace(/:/g, '')

  const estimatedHeight = estimateDiagramHeight(content)

  useEffect(() => {
    let mounted = true
    setIsLoading(true)

    async function renderDiagram() {
      if (!containerRef.current) return

      try {
        const mermaid = (await import('mermaid')).default

        if (!mounted) return

        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          securityLevel: 'strict',
        })

        containerRef.current.innerHTML = ''

        const { svg } = await mermaid.render(`mermaid-${uniqueId}`, content)
        if (containerRef.current && mounted) {
          containerRef.current.innerHTML = svg
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Mermaid rendering error:', error)
        setError('Failed to render diagram')
        if (containerRef.current && mounted) {
          containerRef.current.innerHTML = `<pre>${content}</pre>`
        }
        setIsLoading(false)
      }
    }

    renderDiagram()

    return () => {
      mounted = false
    }
  }, [content, uniqueId])

  if (error) {
    return (
      <div className="border-red-6 bg-red-3 text-red-11 rounded-md border p-4">
        {error}
        <pre className="text-red-11 mt-2 text-sm">{content}</pre>
      </div>
    )
  }

  return (
    <div className="my-4 flex justify-center">
      {isLoading && <SkeletonPulse className="w-full" style={{ height: estimatedHeight }} />}
      <div ref={containerRef} className={isLoading ? 'hidden' : 'block'} />
    </div>
  )
}
