'use client'

import { useMessageFeed } from '@/lib/api/messages'
import { useThread } from '@/lib/api/threads'
import { api } from '~/_generated/api'
import { useMutation } from 'convex/react'
import { Composer } from '../components/Composer'
import { MessageFeed } from '../components/MessageFeed'
import { PageContent, PageFooter, PageHeader, PageLayout } from '../components/PageLayout'

export default function Page({ params }: { params: { id: string } }) {
  const thread = useThread(params.id)
  const messages = useMessageFeed(params.id)

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
        <PageHeader>{thread?.title ?? 'Untitled'}</PageHeader>
        <PageContent className="">
          <MessageFeed messages={messages} />
        </PageContent>
        <PageFooter>
          <Composer onRunSubmit={handleRunSubmit} />
        </PageFooter>
      </PageLayout>

      <PageLayout>
        <PageHeader>{thread?.title ?? 'Untitled'}</PageHeader>
        <PageContent>
          <MessageFeed messages={messages} />
        </PageContent>
        <PageFooter>
          <Composer onRunSubmit={handleRunSubmit} />
        </PageFooter>
      </PageLayout>
    </PageLayout>
  )
}
