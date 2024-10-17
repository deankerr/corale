import { cn } from '@corale/esuite/app/lib/utils'
import { Link } from '@corale/esuite/components/ui/Link'
import * as Icons from '@phosphor-icons/react/dist/ssr'

export const EmptyPage = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div {...props} className={cn('flex-col-center h-full w-full', className)}>
      <Icons.Cat weight="thin" className="text-accentA-11 size-64 shrink-0 opacity-60" />

      <div className="my-8 font-mono text-xl">
        There doesn&apos;t appear to be anything at this address.
      </div>

      <Link href="/">Home</Link>
    </div>
  )
}
