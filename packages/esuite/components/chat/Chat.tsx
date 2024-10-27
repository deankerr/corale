'use client'

import { MessageSearchResults } from '@/components/chat/panels/MessageSearchResults'
import { Composer } from '@/components/composer/Composer'
import { Panel, PanelBodyGrid, PanelEmpty, PanelLoading } from '@/components/ui/Panel'
import { useThread } from '@/lib/api/threads'
import { useViewer } from '@/lib/api/users'
import { ChatHeader } from './ChatHeader'
import { ChatBackgroundPanel } from './panels/ChatBackgroundPanel'
import { MessageFeed2 } from './panels/MessageFeed2'

export const Chat = ({ threadId }: { threadId: string }) => {
  const thread = useThread(threadId)
  const { isViewer } = useViewer(thread?.userId)

  if (!thread) return thread === null ? <PanelEmpty /> : <PanelLoading />
  return (
    <Panel>
      <ChatHeader threadId={threadId} />

      {/* > body */}
      <PanelBodyGrid>
        <ChatBackgroundPanel />
        <MessageFeed2 threadId={threadId} />
        <MessageSearchResults threadId={threadId} />
      </PanelBodyGrid>

      {/* > composer */}
      {isViewer && <Composer threadId={threadId} />}
    </Panel>
  )
}
