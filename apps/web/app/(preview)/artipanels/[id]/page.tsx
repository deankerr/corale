'use client'

import { Button, IconButton } from '@/components/ui/Button'
import { RelativeTimeAgo } from '@/components/ui/RelativeTimeAgo'
import { useMessageFeed } from '@/lib/api/messages'
import { useThread } from '@/lib/api/threads'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { useState } from 'react'
import { ChatMenu } from '../../_components/chat/ChatMenu'
import { Composer } from '../../artifacts/components/Composer'
import { BasicMessageFeed } from '../../artifacts/components/MessageFeed'
import { Page } from '../../shared/layout/Page'
import { Panel, PanelContent, PanelFooter, PanelGroup, PanelHeader } from '../../shared/layout/Panel'

export default function ArtipanelsPage({ params }: { params: { id: string } }) {
  return <ChatWithPanelsPage threadId={params.id} />
}

function ChatWithPanelsPage({ threadId }: { threadId: string }) {
  const thread = useThread(threadId)
  const messages = useMessageFeed(threadId, 40)

  const handleSubmit = async ({ text }: { text: string }) => {
    console.log('Sending message:', text)
  }

  const [showDetailsPanel, setShowDetailsPanel] = useState(false)
  const [showArtifactPanel, setShowArtifactPanel] = useState(true)

  return (
    <Page>
      <PanelHeader className="border-b">
        <Button variant="ghost" color="gray" highContrast onClick={() => setShowDetailsPanel(!showDetailsPanel)}>
          <Icons.Chat />
          {thread?.title ?? 'Untitled Chat'}
        </Button>

        {thread && <ChatMenu thread={thread} />}

        <IconButton
          variant="soft"
          size="1"
          onClick={() => setShowArtifactPanel(!showArtifactPanel)}
          aria-label="Artifact"
        >
          <Icons.Code />
        </IconButton>
      </PanelHeader>

      <PanelGroup className="flex-1">
        {/* Left Panel - Details sidebar */}
        <Panel width="md" hidden={!showDetailsPanel}>
          <PanelHeader>
            <Icons.Info />
            Details
          </PanelHeader>
          <PanelContent>
            <h3 className="font-medium">Thread Info</h3>
            <p className="text-muted-foreground">ID: {threadId}</p>
            <p className="text-muted-foreground">Title: {thread?.title ?? 'Untitled'}</p>
            <p className="text-muted-foreground">
              Created: <RelativeTimeAgo time={thread?._creationTime ?? 0} />
            </p>
            <p className="text-muted-foreground">Messages: {messages.results.length}</p>
          </PanelContent>
        </Panel>

        {/* Center Panel - Chat messages and composer */}
        <Panel width="auto">
          <PanelContent>
            <BasicMessageFeed messages={messages} />
          </PanelContent>
          <PanelFooter className="pb-3">
            <Composer onSubmit={handleSubmit} />
          </PanelFooter>
        </Panel>

        {/* Right Panel - Artifact preview */}
        <Panel width="lg" hidden={!showArtifactPanel}>
          <PanelHeader className="bg-muted/50">
            <Icons.Code size={16} />
            Artifact Preview
          </PanelHeader>
          <PanelContent>
            <div className="flex h-full items-center justify-center">
              <div className="text-muted-foreground">Select a message to preview its artifact</div>
            </div>
          </PanelContent>
        </Panel>
      </PanelGroup>
    </Page>
  )
}
