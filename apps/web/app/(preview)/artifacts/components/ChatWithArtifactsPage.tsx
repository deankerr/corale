'use client'

import { useMessageFeed } from '@/lib/api/messages'
import { useThread } from '@/lib/api/threads'
import { api } from '@corale/backend'
import { useMutation } from 'convex/react'
import { ArtifactPreviewSidePage } from '../../shared/ArtifactPage'
import { PageContent, PageFooter, PageHeader, PageLayout } from '../../shared/PageLayout'
import { Composer } from '../components/Composer'
import { MessageFeed } from '../components/MessageFeed'

export default function ChatWithArtifactsPage({ threadId }: { threadId: string }) {
  const thread = useThread(threadId)
  const messages = useMessageFeed(threadId, 40)

  const createRun = useMutation(api.entities.threads.runs.create)
  const handleRunSubmit = async (args: { modelId: string; text: string }) => {
    if (!thread) return
    await createRun({
      stream: true,
      threadId: thread._id,
      model: { id: args.modelId },
      appendMessages: [{ role: 'user', text: args.text }],
    })
  }

  return (
    <PageLayout className="flex-row divide-x">
      <PageLayout>
        <PageHeader className="border-b">{thread?.title ?? 'Untitled'}</PageHeader>
        <PageContent className="items-center [&>div]:max-w-3xl">
          <MessageFeed messages={messages} />
        </PageContent>
        <PageFooter className="[&>div]:max-w-3xl">
          <Composer onRunSubmit={handleRunSubmit} />
        </PageFooter>
      </PageLayout>

      <ArtifactPreviewSidePage />
    </PageLayout>
  )
}
