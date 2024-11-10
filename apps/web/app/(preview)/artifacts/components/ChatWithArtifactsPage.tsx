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
import { PageContent, PageFooter, PageHeader, PageLayout } from '../../shared/PageLayout'
import { Composer } from '../components/Composer'
import { MessageFeed } from '../components/MessageFeed'
import { artifactDisplayAtom, type Artifact } from './atoms'

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

  const [artifact, setArtifact] = useAtom(artifactDisplayAtom)

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
            {getArtifactIcon(artifact)}
            {artifact.title}
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

function getArtifactIcon(artifact: Artifact) {
  if (artifact.type === 'svg') return <Icons.FileSvg size={20} />
  if (artifact.type === 'html') return <Icons.FileHtml size={20} />
  return <Icons.FileCode size={20} />
}
