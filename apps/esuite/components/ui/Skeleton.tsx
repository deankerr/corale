import { cn, twx } from '@/app/lib/utils'

export function SkeletonPulse({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md border-grayA-3 bg-grayA-2', className)}
      aria-hidden
      tabIndex={-1}
      {...props}
    />
  )
}

export const SkeletonShimmer = twx.div.attrs({
  tabIndex: -1,
  'aria-hidden': true,
})`
  isolate h-8 w-full overflow-hidden rounded-md bg-grayA-2 shimmer
`
