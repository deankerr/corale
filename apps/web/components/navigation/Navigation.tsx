'use client'

import { AppLogo } from '@/components/icons/AppLogo'
import { UserButtons } from '@/components/layout/UserButtons'
import { AdminOnlyUi } from '@/components/util/AdminOnlyUi'
import { cn } from '@/lib/utils'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Authenticated } from 'convex/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NavItem = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof Link>) => {
  const pathname = usePathname()
  const path = props.href.toString()
  const isActive = path !== '/' && pathname.startsWith(path)
  return (
    <Link
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'hover:bg-gray-a2 aria-[current=page]:bg-gray-a3 grid h-10 shrink-0 grid-cols-[2.75rem_13.25rem] items-center transition-all',
        className,
      )}
      {...props}
    />
  )
}

export const Navigation = ({ className, children, ...props }: React.ComponentPropsWithoutRef<'div'>) => {
  return (
    <div className={cn('bg-gray-1 h-full overflow-hidden', className)} {...props}>
      <div className="-ml-px flex h-full w-60 flex-col text-sm font-medium">
        <div className="h-12">
          <Link href="/" className="grid h-12 w-fit grid-cols-[2.75rem_auto] items-center">
            <AppLogo className="text-accent-11 size-6 place-self-center" />
            <div className="text-xl font-semibold leading-none tracking-tight">
              e<span className="text-lg leading-none">⋆</span>suite
            </div>
          </Link>
        </div>

        <Authenticated>
          <div className="space-y-1 py-2">
            <NavItem href={'/chats'}>
              <Icons.Chat size={20} className="text-accent-11 place-self-center" />
              <div className="line-clamp-2 select-none overflow-hidden pr-3">Chats</div>
            </NavItem>

            <NavItem href={'/patterns'}>
              <Icons.Drone size={20} className="text-accent-11 place-self-center" />
              <div className="line-clamp-2 select-none overflow-hidden pr-3">Patterns</div>
            </NavItem>

            <NavItem href={'/artifacts'}>
              <Icons.CodeBlock size={20} className="text-accent-11 place-self-center" />
              <div className="line-clamp-2 select-none overflow-hidden pr-3">Artifacts</div>
            </NavItem>

            <NavItem href={'/models'}>
              <Icons.Cube size={20} className="text-accent-11 place-self-center" />
              <div className="line-clamp-2 select-none overflow-hidden pr-3">Models</div>
            </NavItem>

            <NavItem href={'/generations'}>
              <Icons.Sparkle size={20} className="text-accent-11 place-self-center" />
              <div className="line-clamp-2 select-none overflow-hidden pr-3">Generations</div>
            </NavItem>

            <NavItem href={'/collections'}>
              <Icons.FolderStar size={20} className="text-accent-11 place-self-center" />
              <div className="line-clamp-2 select-none overflow-hidden pr-3">Collections</div>
            </NavItem>

            <NavItem href={'/prompts'}>
              <Icons.NotePencil size={20} className="text-accent-11 place-self-center" />
              <div className="line-clamp-2 select-none overflow-hidden pr-3">Prompts</div>
            </NavItem>
          </div>
        </Authenticated>

        <div className="grow" />

        <div className="grid h-12 shrink-0 grid-cols-[2.75rem_13.75rem] place-items-center">
          <UserButtons />
          <div className="justify-self-start">
            <AdminOnlyUi>
              <Link href="/admin" className="text-gray-10 hover:text-gray-12">
                Admin
              </Link>
            </AdminOnlyUi>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}
