'use client'

import { NavigationButton } from '@/components/navigation/NavigationSheet'
import { NavPanel, PanelHeader, PanelTitle } from '@/components/ui/Panel'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { usePatterns } from '@/lib/api/patterns'
import { cn } from '@/lib/utils'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from '../ui/Button'

export const PatternsNavPanel = () => {
  const patterns = usePatterns()
  const params = useParams()
  const currentXid = params.id?.[0]

  if (!patterns) return null
  return (
    <NavPanel className={cn(params.id && 'hidden sm:flex')}>
      <PanelHeader>
        <NavigationButton />

        <PanelTitle href="/patterns">Patterns</PanelTitle>

        <div className="grow" />

        <Link href="/patterns">
          <Button variant="surface">
            Create <Icons.Plus size={20} />
          </Button>
        </Link>
      </PanelHeader>

      <ScrollArea>
        <div className="flex flex-col gap-1 overflow-hidden p-1">
          {patterns?.map((pattern) => (
            <Link
              key={pattern._id}
              href={`/patterns/${pattern.xid}`}
              className={cn(
                'hover:bg-gray-2 truncate rounded-sm px-2 py-3 text-sm font-medium',
                currentXid === pattern.xid && 'bg-gray-3 hover:bg-gray-3',
              )}
            >
              {pattern.name ?? `Untitled (${pattern.xid})`}
            </Link>
          ))}
        </div>
      </ScrollArea>
    </NavPanel>
  )
}
