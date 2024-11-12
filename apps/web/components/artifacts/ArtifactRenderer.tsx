'use client'

import { SVGRenderer } from '@/components/artifacts/SVGRenderer'
import { memo } from 'react'
import { toast } from 'sonner'
import { ArtifactErrorBoundary } from './ArtifactErrorBoundary'
import { HTMLRenderer, type IFrameInternalError } from './HTMLRenderer'
import type { Artifact } from './types'

export const ArtifactRenderer = memo(({ content, language }: Artifact) => {
  return (
    <ArtifactErrorBoundary>
      {language === 'svg' ? (
        <SVGRenderer codeString={content} />
      ) : language === 'html' ? (
        <HTMLRenderer codeString={content} onIFrameInternalError={handleIFrameInternalError} />
      ) : (
        <pre>{content}</pre>
      )}
    </ArtifactErrorBoundary>
  )
})

ArtifactRenderer.displayName = 'ArtifactRenderer'

function handleIFrameInternalError(error: IFrameInternalError) {
  console.warn(error)
  toast.warning(`Artifact HTMLRenderer error`, { description: `${error.name}: ${error.message}` })
}
