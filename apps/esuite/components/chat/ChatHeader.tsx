import { useState } from 'react'
import { useThread } from '@corale/esuite/app/lib/api/threads'
import { PanelHeader, PanelTitle } from '@corale/esuite/components/ui/Panel'
import * as Icons from '@phosphor-icons/react/dist/ssr'

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
    <PanelHeader className="bg-grayA-1">
      <NavigationButton />
      <PanelTitle href={`/chats/${thread.slug}`}>{thread.title ?? 'Untitled Thread'}</PanelTitle>
      <ChatMenu threadId={thread.slug} />
      <FavouriteButton threadId={thread.slug} />

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
