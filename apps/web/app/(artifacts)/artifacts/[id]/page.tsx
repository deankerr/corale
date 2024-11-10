'use client'

import { HTMLRenderer } from '@/components/artifacts/HTMLRenderer'
import { SVGRenderer } from '@/components/artifacts/SVGRenderer'
import { IconButton } from '@/components/ui/Button'
import { useMessageFeed } from '@/lib/api/messages'
import { useThread } from '@/lib/api/threads'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { api } from '~/_generated/api'
import { useMutation } from 'convex/react'
import { useAtom } from 'jotai'
import { Composer } from '../components/Composer'
import { MessageFeed } from '../components/MessageFeed'
import { PageContent, PageFooter, PageHeader, PageLayout } from '../components/PageLayout'
import { artifactAtom } from './atoms'

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

  const [artifact, setArtifact] = useAtom(artifactAtom)

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

      {artifact && (
        <PageLayout>
          <PageHeader className="border-b">
            Artifact ({artifact.type})
            <div className="grow" />
            <IconButton variant="ghost" size="2" onClick={() => setArtifact(null)} aria-label="Close">
              <Icons.X />
            </IconButton>
          </PageHeader>
          <PageContent>
            {artifact.type === 'svg' ? (
              <SVGRenderer svgText={artifact.content} />
            ) : (
              <HTMLRenderer htmlText={artifact.content} />
            )}
          </PageContent>
        </PageLayout>
      )}
    </PageLayout>
  )
}
