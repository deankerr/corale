import { PanelHeader, PanelTitle } from '@/components/ui/Panel'
import { useThread } from '@/lib/api/threads'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { useState } from 'react'
import { NavigationButton } from '../navigation/NavigationSheet'
import { IconButton } from '../ui/Button'
import { ChatMenu } from './ChatMenu'
import { ChatSearchField } from './ChatSearchField'
import { FavouriteButton } from './FavouriteButton'

export const ChatHeader = ({ threadId }: { threadId: string }) => {
  const thread = useThread(threadId)
  const [showRunsPanel, setShowRunsPanel] = useState(false)

  if (!thread) return null
  return (
    <PanelHeader className="bg-gray-a1">
      <NavigationButton />
      <PanelTitle href={`/chats/${thread.xid}`}>{thread.title ?? 'Untitled Thread'}</PanelTitle>
      <ChatMenu threadId={thread.xid} />
      <FavouriteButton threadId={thread.xid} />

      <div className="grow" />

      <ChatSearchField />
      <IconButton
        aria-label="Show runs"
        variant="surface"
        color={showRunsPanel ? 'orange' : 'gray'}
        onClick={() => setShowRunsPanel(!showRunsPanel)}
        className="ml-2"
      >
        <Icons.ListPlus />
      </IconButton>
    </PanelHeader>
  )
}
