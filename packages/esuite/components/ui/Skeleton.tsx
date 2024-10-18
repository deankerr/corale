import { cn, twx } from '@/lib/utils'

export function SkeletonPulse({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('border-gray-a3 bg-gray-a2 animate-pulse rounded-md', className)}
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
  isolate h-8 w-full overflow-hidden rounded-md bg-gray-a2 shimmer
`
