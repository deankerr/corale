import { cn, twx } from '@corale/esuite/app/lib/utils'

export function SkeletonPulse({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('border-grayA-3 bg-grayA-2 animate-pulse rounded-md', className)}
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
