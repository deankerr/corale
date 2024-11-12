'use client'

import { SVGRenderer } from '@/components/artifacts/SVGRenderer'
import { ArtifactErrorBoundary } from './ArtifactErrorBoundary'
import { HTMLRenderer } from './HTMLRenderer'

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
        <HTMLRenderer htmlText={content} />
      ) : (
        <pre>{content}</pre>
      )}
    </ArtifactErrorBoundary>
  )
}
