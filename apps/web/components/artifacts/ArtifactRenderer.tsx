'use client'

import { SVGRenderer } from '@/components/artifacts/SVGRenderer'
import { HTMLRenderer } from './HTMLRenderer'

export type Artifact = {
  content: string
  language: string
  metadata?: string[]
  title?: string
  version?: string
}

export const ArtifactRenderer = ({ content, language }: Artifact) => {
  if (language === 'svg') {
    return <SVGRenderer svgText={content} sanitize={false} />
  }

  if (language === 'html') {
    return <HTMLRenderer htmlText={content} />
  }

  return <pre>{content}</pre>
}
