'use client'

import { MessageSearchResults } from '@/components/chat/panels/MessageSearchResults'
import { Composer } from '@/components/composer/Composer'
import { Panel, PanelBody, PanelBodyGrid, PanelEmpty, PanelLoading } from '@/components/ui/Panel'
import { useThread } from '@/lib/api/threads'
import { useViewer } from '@/lib/api/users'
import { ChatHeader } from './ChatHeader'
import { ChatBackgroundPanel } from './panels/ChatBackgroundPanel'
import { VirtualizedMessageFeed } from './panels/VirtualizedMessageFeed'

export const Chat = ({ threadId }: { threadId: string }) => {
  const thread = useThread(threadId)
  const { isViewer } = useViewer(thread?.userId)
  const shouldShowComposer = isViewer || threadId === 'new'

  if (!thread) return thread === null ? <PanelEmpty /> : <PanelLoading />
  return (
    <Panel>
      <ChatHeader threadId={threadId} />

      {/* > body */}
      <PanelBodyGrid>
        <ChatBackgroundPanel />
        <PanelBody>
          <VirtualizedMessageFeed threadId={threadId} />
        </PanelBody>
        <MessageSearchResults threadId={threadId} />
      </PanelBodyGrid>

      {/* > composer */}
      {shouldShowComposer && <Composer threadId={threadId} />}
    </Panel>
  )
}
