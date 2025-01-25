'use client'

import { ErrorPage } from '@/components/pages/ErrorPage'

export default function Error(props: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="h-dvh w-full">
      <ErrorPage {...props} />
    </div>
  )
}
