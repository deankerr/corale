import { Scanlines } from '@/components/effects/Scanlines'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button } from '@radix-ui/themes'
import { useEffect } from 'react'

export const ErrorPage = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
  const message = error.message.replaceAll('\n', '\n\n')

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex-col-center h-full min-h-fit w-full gap-4 overflow-hidden p-4">
      <Scanlines className="animate-scanlinesDown text-ruby-6 pointer-events-none absolute bottom-0 h-[110%] w-full opacity-60" />

      <Icons.SmileyXEyes className="text-red-10 -m-4 size-48 shrink-0 opacity-60" />

      <h2 className="text-red-10 font-mono text-xl">error</h2>

      <pre className="border-red-11 bg-red-2 w-full max-w-3xl overflow-y-auto overflow-x-hidden whitespace-pre-wrap rounded-md border p-4 font-mono text-sm">
        {message}
      </pre>

      <Button color="red" variant="solid" onClick={() => reset()}>
        Retry
      </Button>
    </div>
  )
}
