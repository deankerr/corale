'use client'

import { ErrorPage } from '@corale/esuite/components/pages/ErrorPage'

export default function Error(props: any) {
  return (
    <div className="h-dvh w-full">
      <ErrorPage {...props} />
    </div>
  )
}
