import { ScrollArea } from '@corale/ui/components/ui/scroll-area'
import { cn } from '@corale/ui/lib/utils'

const panelWidths = {
  sm: 'w-64',
  md: 'w-80',
  lg: 'w-96',
  xl: 'w-[448px]',
  full: 'w-full',
  auto: 'flex-1',
} as const

type PanelSubComponentProps = {
  children?: React.ReactNode
  className?: string
}

export function Panel({
  children,
  className,
  width = 'auto',
  hidden = false,
}: {
  children?: React.ReactNode
  className?: string
  width?: keyof typeof panelWidths
  hidden?: boolean
}) {
  return (
    <div
      className={cn(
        'relative flex min-h-0 min-w-0 flex-col overflow-hidden',
        panelWidths[width],
        hidden && 'hidden',
        className,
      )}
      hidden={hidden}
    >
      {children}
    </div>
  )
}

export function PanelHeader({ children, className }: PanelSubComponentProps) {
  return (
    <header className={cn('flex h-12 min-w-0 shrink-0 items-center gap-2 border-b px-3 text-[15px]', className)}>
      {children}
    </header>
  )
}

export function PanelContent({ children, className }: PanelSubComponentProps) {
  return (
    <ScrollArea className="min-w-0 flex-1">
      <div className={cn('p-3', className)}>{children}</div>
    </ScrollArea>
  )
}

export function PanelFooter({ children, className }: PanelSubComponentProps) {
  return (
    <footer className={cn('flex min-h-12 w-full min-w-0 shrink-0 items-center justify-center gap-2 px-3', className)}>
      {children}
    </footer>
  )
}

export function PanelGroup({ children, className }: PanelSubComponentProps) {
  return <div className={cn('flex h-full min-h-0 divide-x', className)}>{children}</div>
}

export function PanelStack({ children, className }: PanelSubComponentProps) {
  return <div className={cn('flex h-full min-h-0 flex-col divide-y', className)}>{children}</div>
}

export function PanelOverlayRegion({ children }: { children: React.ReactNode }) {
  return <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">{children}</div>
}

export function PanelOverlay({
  children,
  className,
  side = 'bottom',
  isOpen,
}: {
  children: React.ReactNode
  className?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  isOpen: boolean
}) {
  const baseStyles = {
    top: 'top-0 -translate-y-full',
    right: 'right-0 top-1/2 -translate-y-1/2 translate-x-full',
    bottom: 'bottom-0 translate-y-full',
    left: 'left-0 top-1/2 -translate-y-1/2 -translate-x-full',
  }

  const openStyles = {
    top: 'translate-y-0',
    right: 'translate-x-0',
    bottom: 'translate-y-0',
    left: 'translate-x-0',
  }

  return (
    <div
      className={cn(
        'pointer-events-auto absolute left-0 right-0 mx-auto',
        'transform transition-all duration-200 ease-in-out',
        baseStyles[side],
        isOpen && openStyles[side],
        className,
      )}
    >
      {children}
    </div>
  )
}
