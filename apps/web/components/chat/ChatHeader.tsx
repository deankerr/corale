import { PanelHeader, PanelTitle } from '@/components/ui/Panel'
import { useThread } from '@/lib/api/threads'
import { NavigationButton } from '../navigation/NavigationSheet'
import { ChatMenu } from './ChatMenu'
import { ChatSearchField } from './ChatSearchField'
import { FavouriteButton } from './FavouriteButton'

export const ChatHeader = ({ threadId }: { threadId: string }) => {
  const thread = useThread(threadId)
  if (!thread) return null

  return (
    <PanelHeader className="bg-gray-a1">
      <NavigationButton />
      <PanelTitle href={`/chats/${thread.xid}`}>{thread.title ?? 'Untitled Thread'}</PanelTitle>
      <ChatMenu threadId={thread.xid} />
      <FavouriteButton threadId={thread.xid} />

      <div className="grow" />

      <ChatSearchField />
    </PanelHeader>
  )
}
