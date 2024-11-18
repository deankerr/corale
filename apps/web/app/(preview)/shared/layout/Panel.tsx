import { ScrollArea } from '@/components/ui/ScrollArea'
import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'

type PanelWidth = 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'auto'

const panelWidths: Record<PanelWidth, string> = {
  sm: 'w-64',
  md: 'w-80',
  lg: 'w-96',
  xl: 'w-[448px]',
  full: 'w-full',
  auto: 'flex-1',
}

type PanelProps = {
  children?: ReactNode
  className?: string
  width?: PanelWidth
  hidden?: boolean
}

export function Panel({ children, className, width = 'auto', hidden = false }: PanelProps) {
  return (
    <div
      className={cn('flex min-h-0 flex-col overflow-hidden', panelWidths[width], hidden && 'hidden', className)}
      hidden={hidden}
    >
      {children}
    </div>
  )
}

export function PanelHeader({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <header className={cn('flex h-12 w-full shrink-0 items-center gap-2 border-b px-3', className)}>{children}</header>
  )
}

export function PanelContent({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <ScrollArea className="flex-1">
      <div className={cn('flex flex-col p-3', className)}>{children}</div>
    </ScrollArea>
  )
}

export function PanelFooter({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <footer className={cn('flex min-h-12 w-full shrink-0 items-center justify-center gap-2 px-3', className)}>
      {children}
    </footer>
  )
}

export function PanelGroup({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={cn('flex h-full min-h-0 divide-x', className)}>{children}</div>
}

export function PanelStack({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={cn('flex h-full min-h-0 flex-col divide-y', className)}>{children}</div>
}
