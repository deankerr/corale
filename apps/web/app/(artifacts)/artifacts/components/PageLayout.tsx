import { cn } from '@/lib/utils'

export function PageLayout({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn('bg-background text-foreground flex h-full flex-1 flex-col overflow-hidden text-sm', className)}>
      {children}
    </div>
  )
}

export function PageHeader({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <header className={cn('flex-start border-gray-a3 z-10 h-12 shrink-0 items-center gap-2 px-4 shadow-lg', className)}>
      {children}
    </header>
  )
}

export function PageContent({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={cn('flex flex-1 flex-col overflow-y-auto overflow-x-hidden', className)}>{children}</div>
}

export function PageFooter({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <footer
      className={cn(
        'flex-center border-gray-a3 z-10 min-h-12 shrink-0 items-center gap-2 px-4 pb-4 shadow-lg',
        className,
      )}
    >
      {children}
    </footer>
  )
}
