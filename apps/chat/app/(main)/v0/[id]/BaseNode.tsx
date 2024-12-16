import { cn } from '@corale/ui/lib/utils'
import React from 'react'

type BaseNodeProps = React.HTMLAttributes<HTMLDivElement> & { selected?: boolean }

export const BaseNode = React.forwardRef<HTMLDivElement, BaseNodeProps>(({ className, selected, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'bg-card text-card-foreground ring-ring/60 max-w-2xl whitespace-pre-wrap rounded-md border p-5',
      className,
      selected ? 'border-muted-foreground shadow-lg' : '',
      'hover:ring-1',
    )}
    tabIndex={0}
    {...props}
  />
))
BaseNode.displayName = 'BaseNode'
