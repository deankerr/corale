'use client'

import { useThread } from '@corale/esuite/app/lib/api/threads'
import { ChatToolbar } from '@corale/esuite/components/chat/ChatToolbar'
import { MessageSearchResults } from '@corale/esuite/components/chat/panels/MessageSearchResults'
import { Composer } from '@corale/esuite/components/composer/Composer'
import { Panel, PanelBodyGrid, PanelEmpty, PanelLoading } from '@corale/esuite/components/ui/Panel'

import { ChatHeader } from './ChatHeader'
import { ChatBackgroundPanel } from './panels/ChatBackgroundPanel'
import { MessageFeed2 } from './panels/MessageFeed2'
import { RunsPanel } from './panels/RunsPanel'

export const Chat = ({ threadId }: { threadId: string }) => {
  const thread = useThread(threadId)

  if (!thread) return thread === null ? <PanelEmpty /> : <PanelLoading />
  return (
    <Panel>
      <ChatHeader threadId={threadId} />
      <ChatToolbar threadId={threadId} />

      {/* > body */}
      <PanelBodyGrid>
        <ChatBackgroundPanel />
        <MessageFeed2 threadId={threadId} />
        <MessageSearchResults threadId={threadId} />
        <RunsPanel threadId={threadId} />
      </PanelBodyGrid>

      {/* > composer */}
      {thread.user.isViewer && <Composer threadId={threadId} />}
    </Panel>
  )
}
