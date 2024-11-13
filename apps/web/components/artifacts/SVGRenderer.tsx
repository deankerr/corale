'use client'

import { CalloutErrorBasic } from '@/components/ui/Callouts'
import { useEffect, useState } from 'react'

export const SVGRenderer = ({ codeString }: { codeString: string }) => {
  const [blobUrl, setBlobUrl] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setError(null)

    let url: string | null = null

    try {
      const blob = new Blob([codeString], { type: 'image/svg+xml' })
      url = URL.createObjectURL(blob)
      setBlobUrl(url)
    } catch (error) {
      console.error('Error processing SVG:', error)
      setError('An error occurred while attempting to process the SVG content.')
    }

    return () => {
      if (url) {
        URL.revokeObjectURL(url)
        setBlobUrl('')
      }
    }
  }, [codeString])

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
