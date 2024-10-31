'use client'

import { NavigationButton } from '@/components/navigation/NavigationSheet'
import { Button } from '@/components/ui/Button'
import { NavPanel, PanelHeader, PanelTitle } from '@/components/ui/Panel'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { usePrompts } from '@/lib/api/prompts'
import { cn } from '@/lib/utils'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export const PromptsNavPanel = () => {
  const params = useParams()
  const prompts = usePrompts()

  return (
    <NavPanel>
      <PanelHeader>
        <NavigationButton />
        <PanelTitle href="/prompts">Prompts</PanelTitle>

        <div className="grow" />
        <Link href="/prompts/new">
          <Button variant="surface">
            Create <Icons.Plus size={20} />
          </Button>
        </Link>
      </PanelHeader>

      <ScrollArea>
        <div className="flex flex-col gap-1 overflow-hidden p-1">
          {prompts?.map((prompt) => (
            <Link
              key={prompt._id}
              href={`/prompts/${prompt._id}`}
              className={cn(
                'hover:bg-gray-2 truncate rounded-sm px-2 py-3 text-sm font-medium',
                prompt._id === params.textsId && 'bg-gray-3 hover:bg-gray-3',
              )}
            >
              {prompt.title ?? 'Untitled'}
            </Link>
          ))}
        </div>
      </ScrollArea>
    </NavPanel>
  )
}
