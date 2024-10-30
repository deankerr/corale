import { cn } from '@/lib/utils'

type PageLayoutProps = {
  header: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function PageLayout({ header, children, className }: PageLayoutProps) {
  return (
    <div className="bg-background text-foreground flex h-full flex-col" data-testid="page-layout">
      {header}

      <div
        className={cn('flex flex-1 flex-col overflow-y-auto overflow-x-hidden', className)}
        data-testid="page-content"
      >
        {children}
      </div>
    </div>
  )
}

export function PageHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <header className={cn('flex h-12 shrink-0 items-center gap-2 border-b px-3', className)} data-testid="page-header">
      {children}
    </header>
  )
}
