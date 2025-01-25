'use client'

import { ClientOnly } from '@/components/util/ClientOnly'
import { cn, environment } from '@/lib/utils'
import { useWindowSize } from '@react-hookz/web'

export function TailwindBreakpointIndicator() {
  const { width, height } = useWindowSize()
  if (environment !== 'dev') return null
  const content =
    "before:content-['xs'] sm:before:content-['sm'] md:before:content-['md'] lg:before:content-['lg'] xl:before:content-['xl'] 2xl:before:content-['2xl']"
  const dimensions = width && height ? `⋅${width}x${height}` : null

  return (
    <ClientOnly>
      <div
        suppressHydrationWarning
        className={cn('fixed bottom-0 right-0 z-[99999] bg-[#111111] text-[0.5rem] text-[#BBBBBB] opacity-30', content)}
      >
        <span>{dimensions}</span>
      </div>
    </ClientOnly>
  )
}
