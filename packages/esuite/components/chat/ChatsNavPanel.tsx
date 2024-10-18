'use client'

import { NavigationButton } from '@/components/navigation/NavigationSheet'
import { IconButton } from '@/components/ui/Button'
import { NavPanel, PanelHeader, PanelTitle } from '@/components/ui/Panel'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { useThreads } from '@/lib/api/threads'
import { cn } from '@/lib/utils'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button } from '@radix-ui/themes'
import fuzzysort from 'fuzzysort'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { SearchField } from '../ui/SearchField'

export const ChatsNavPanel = () => {
  const threads = useThreads()
  const params = useParams()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [searchText, setSearchText] = useState('')

  if (!threads) return null
  if (isCollapsed) {
    return (
      <div className="absolute left-[3.75rem] top-2.5 z-10">
        <IconButton
          aria-label="Expand sidebar"
          variant="ghost"
          color="gray"
          className="hidden sm:flex"
          onClick={() => setIsCollapsed(false)}
        >
          <Icons.CaretRight size={20} />
        </IconButton>
      </div>
    )
  }

  // .length
  const sortResults = fuzzysort
    .go(searchText.trim(), threads ?? [], {
      key: 'title',
      all: true,
    })
    .map(({ obj, score }) => ({ ...obj, _fuzzysort: score }))
  const notMatched = threads.filter((thread) => sortResults.find((result) => result._id === thread._id) === undefined)
  const threadsSorted = [...sortResults, ...notMatched]

  return (
    <NavPanel className={cn(params.threadId && 'hidden sm:flex', isCollapsed && 'sm:hidden')}>
      <PanelHeader>
        <NavigationButton />
        <PanelTitle href="/chats">Chats</PanelTitle>

        <div className="grow" />
        <Link href="/chats/new">
          <Button variant="surface">
            Create <Icons.Plus size={20} />
          </Button>
        </Link>

        <IconButton
          aria-label="Collapse sidebar"
          variant="ghost"
          color="gray"
          onClick={() => setIsCollapsed(true)}
          className="ml-1 hidden sm:flex"
        >
          <Icons.CaretLeft size={20} />
        </IconButton>
      </PanelHeader>

      <div className="flex-center h-10 shrink-0 px-1">
        <SearchField className="w-full" value={searchText} onValueChange={setSearchText} />
      </div>

      <ScrollArea>
        <div className="flex flex-col gap-1 overflow-hidden p-1">
          {threadsSorted.map((thread) => (
            <Link
              key={thread._id}
              href={`/chats/${thread.slug}`}
              className={cn(
                'hover:bg-gray-2 truncate rounded-sm px-2 py-3 text-sm font-medium',
                thread.slug === params.threadId && 'bg-gray-3 hover:bg-gray-3',
                !!searchText && !('_fuzzysort' in thread) && 'opacity-50',
              )}
            >
              {thread.title ?? 'Untitled'}
            </Link>
          ))}
        </div>
      </ScrollArea>
    </NavPanel>
  )
}
