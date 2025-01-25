import { ScrollArea } from '@/components/ui/ScrollArea'
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
    <header className={cn('flex-start z-10 h-12 shrink-0 gap-2 border-b px-4 shadow-lg', className)}>{children}</header>
  )
}

export function PageContent({
  scrollArea,
  children,
  className,
}: {
  scrollArea?: boolean
  children?: React.ReactNode
  className?: string
}) {
  if (scrollArea) {
    return (
      <ScrollArea className="flex-1">
        <div className={cn('flex-col-center h-full gap-3 p-3', className)}>{children}</div>
      </ScrollArea>
    )
  }

  return <div className={cn('flex-1 flex-col-start p-3', className)}>{children}</div>
}

export function PageFooter({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <footer className={cn('flex-center z-10 min-h-12 shrink-0 gap-2 px-4 pb-4', className)}>{children}</footer>
}
