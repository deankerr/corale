'use client'

import { VirtualizedMessageFeed } from '@/components/chat/panels/VirtualizedMessageFeed'
import { useMessageFeedQuery } from '@/lib/api/messages'
import { useThread } from '@/lib/api/threads'
import { api } from '@corale/backend'
import { useMutation } from 'convex/react'
import { ChatMenu } from '../../_components/chat/ChatMenu'
import { ArtifactPreviewSidePage } from '../../shared/ArtifactPage'
import { config } from '../../shared/config'
import { PageContent, PageFooter, PageHeader, PageLayout } from '../../shared/PageLayout'
import { Composer } from '../components/Composer'
import { BasicMessageFeed } from '../components/MessageFeed'

export function ChatWithArtifactsPage({ threadId }: { threadId: string }) {
  const thread = useThread(threadId)
  const currentPatternId = thread?.kvMetadata?.['esuite:pattern:xid']
  const messages = useMessageFeedQuery(threadId, 25)

  const createRun = useMutation(api.entities.threads.runs.create)
  const createMessage = useMutation(api.entities.threads.messages.create)
  const handleSubmit = async ({ text, modelId, patternId }: { text: string; modelId?: string; patternId?: string }) => {
    if (!thread || !text.trim()) return

    if (modelId || patternId) {
      return await createRun({
        stream: true,
        threadId: thread._id,
        model: modelId && !patternId ? { id: modelId } : undefined,
        patternId,
        appendMessages: [{ role: 'user', text }],
      })
    }

    return await createMessage({
      threadId: thread._id,
      role: 'user',
      text,
    })
  }

  return (
    <PageLayout className="flex-row divide-x">
      <PageLayout>
        <PageHeader className="border-b">
          {thread?.title ?? 'Untitled'} {thread && <ChatMenu thread={thread} />}
        </PageHeader>
        <PageContent>
          {config.artifactsVirtualFeed ? (
            <VirtualizedMessageFeed threadId={threadId} />
          ) : (
            <BasicMessageFeed messages={messages} />
          )}
        </PageContent>
        <PageFooter className="[&>div]:max-w-3xl">
          <Composer onSubmit={handleSubmit} patternId={currentPatternId} />
        </PageFooter>
      </PageLayout>

      <ArtifactPreviewSidePage />
    </PageLayout>
  )
}
