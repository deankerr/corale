'use client'

import { cn, twx } from '@/app/lib/utils'
import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr'
import { Command as CommandPrimitive } from 'cmdk'
import { forwardRef } from 'react'

const Command = twx(
  CommandPrimitive,
)`flex h-full w-full flex-col overflow-hidden bg-gray-2 outline-none`

const Input = forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div
    className={cn('flex shrink-0 items-center border-b border-grayA-3 px-3', className)}
    cmdk-input-wrapper=""
  >
    <MagnifyingGlass className="mr-2 size-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        'flex h-12 w-full border-none bg-transparent py-3 text-base outline-none placeholder:text-gray-10 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  </div>
))
Input.displayName = CommandPrimitive.Input.displayName

const List = twx(
  CommandPrimitive.List,
)`h-[var(--cmdk-list-height)] max-h-[24rem] scroll-py-1 overflow-y-auto overflow-x-hidden cmdk-animate-list`

const Empty = twx(CommandPrimitive.Empty)`py-6 text-center text-sm`

const Group = twx(
  CommandPrimitive.Group,
)`select-none overflow-hidden p-1 [&_[cmdk-group-heading]]:px-1 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-gray-11 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2`

const Separator = twx(CommandPrimitive.Separator)`-mx-1 h-px bg-grayA-3`

const Item = twx(
  CommandPrimitive.Item,
)`relative flex cursor-pointer select-none items-center gap-4 rounded px-4 py-2.5 text-sm opacity-85 outline-none aria-selected:bg-grayA-4 aria-selected:text-white aria-selected:opacity-100 data-[disabled="false"]:pointer-events-auto data-[disabled="true"]:opacity-50 [&_svg]:size-[1.125rem] [&_svg]:shrink-0`

const Shortcut = twx.span`ml-auto text-xs tracking-widest text-gray-11`

const Loading = twx(CommandPrimitive.Loading)``

export const CmdK = Object.assign(Command, {
  Input,
  List,
  Empty,
  Group,
  Separator,
  Item,
  Shortcut,
  Loading,
})
