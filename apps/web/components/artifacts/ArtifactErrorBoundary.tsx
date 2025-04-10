'use client'

import { environment } from '@/lib/utils'
import { type ReactNode } from 'react'
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'
import { CalloutErrorBasic } from '../ui/Callouts'

function ErrorFallback({ error }: FallbackProps) {
  return (
    <CalloutErrorBasic>
      Failed to render artifact content.
      {environment === 'dev' && <span className="text-gray-10 block text-xs">{error.message}</span>}
    </CalloutErrorBasic>
  )
}

export function ArtifactErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        console.error('Artifact render error:', error, info)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}
