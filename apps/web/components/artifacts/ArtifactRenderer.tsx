'use client'

import { SVGRenderer } from '@/components/artifacts/SVGRenderer'
import { toast } from 'sonner'
import { ArtifactErrorBoundary } from './ArtifactErrorBoundary'
import { HTMLRenderer, type IFrameInternalError } from './HTMLRenderer'

export type Artifact = {
  content: string
  language: string
  metadata?: string[]
  title?: string
  version?: string
}

export const ArtifactRenderer = ({ content, language }: Artifact) => {
  return (
    <ArtifactErrorBoundary>
      {language === 'svg' ? (
        <SVGRenderer svgText={content} sanitize={false} />
      ) : language === 'html' ? (
        <HTMLRenderer htmlText={content} onIFrameInternalError={handleIFrameInternalError} />
      ) : (
        <pre>{content}</pre>
      )}
    </ArtifactErrorBoundary>
  )
}

function handleIFrameInternalError(error: IFrameInternalError) {
  console.warn(error)
  toast.warning(`Artifact HTMLRenderer error`, { description: `${error.name}: ${error.message}` })
}
