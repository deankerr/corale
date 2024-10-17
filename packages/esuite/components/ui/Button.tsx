import { cn } from '@/app/lib/utils'
import { Button as RadixButton, IconButton as RadixIconButton } from '@radix-ui/themes'
import React, { forwardRef } from 'react'
import type { SetRequired } from 'type-fest'

export const IconButton = forwardRef<
  HTMLButtonElement,
  SetRequired<React.ComponentProps<typeof RadixIconButton>, 'aria-label'>
>(({ className, children, ...props }, ref) => {
  return (
    <RadixIconButton
      ref={ref}
      {...props}
      className={cn('shrink-0', props.variant === 'ghost' && 'm-0', className)}
    >
      {children}
    </RadixIconButton>
  )
})

IconButton.displayName = 'IconButton'

export const Button = forwardRef<HTMLButtonElement, React.ComponentProps<typeof RadixButton>>(
  ({ children, className, ...props }, ref) => {
    return (
      <RadixButton
        ref={ref}
        {...props}
        className={cn('shrink-0', props.variant === 'ghost' && 'm-0', className)}
      >
        {children}
      </RadixButton>
    )
  },
)

Button.displayName = 'Button'
