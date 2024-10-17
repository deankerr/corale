import { cn } from '@/app/lib/utils'

export const AdminPageWrapper = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return <div {...props} className={cn('border-grayA-3 h-full grow overflow-auto rounded-lg border p-2', className)} />
}
