'use client'

import { IconButton } from '@/components/ui/Button'
import { useMessageFeed } from '@/lib/api/messages'
import { usePatterns } from '@/lib/api/patterns'
import { useThread } from '@/lib/api/threads'
import { useViewer } from '@/lib/api/users'
import { api, type Thread } from '@corale/backend'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { DropdownMenu } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { ArtifactPreviewSidePage } from '../../shared/ArtifactPage'
import { PageContent, PageFooter, PageHeader, PageLayout } from '../../shared/PageLayout'
import { Composer } from '../components/Composer'
import { MessageFeed } from '../components/MessageFeed'

export function ChatWithArtifactsPage({ threadId }: { threadId: string }) {
  const thread = useThread(threadId)
  const currentPatternId = thread?.kvMetadata?.['esuite:pattern:xid']
  const messages = useMessageFeed(threadId, 40)

  const createRun = useMutation(api.entities.threads.runs.create)
  const createMessage = useMutation(api.entities.threads.messages.create)
  const handleSubmit = async ({ text, modelId, patternId }: { text: string; modelId?: string; patternId?: string }) => {
    if (!thread || !text.trim()) return

    if (modelId || patternId) {
      return await createRun({
        stream: true,
        threadId: thread._id,
        model: modelId ? { id: modelId } : undefined,
        patternId: patternId,
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
          {thread?.title ?? 'Untitled'} <ChatMenu thread={thread} />
        </PageHeader>
        <PageContent className="items-center [&>div]:max-w-3xl">
          <MessageFeed messages={messages} />
        </PageContent>
        <PageFooter className="[&>div]:max-w-3xl">
          <Composer onSubmit={handleSubmit} patternId={currentPatternId} />
        </PageFooter>
      </PageLayout>

      <ArtifactPreviewSidePage />
    </PageLayout>
  )
}

function ChatMenu({ thread }: { thread?: Thread | null }) {
  const { isViewer } = useViewer(thread?.userId)
  const patterns = usePatterns() ?? []
  const currentPatternId = thread?.kvMetadata?.['esuite:pattern:xid']

  const updateThread = useMutation(api.entities.threads.update)
  const handlePatternChange = (patternId: string) => {
    if (!thread) return
    if (patternId === currentPatternId) {
      updateThread({
        threadId: thread._id,
        fields: { kvMetadata: { delete: ['esuite:pattern:xid'] } },
      })
    } else {
      updateThread({
        threadId: thread._id,
        fields: { kvMetadata: { set: { 'esuite:pattern:xid': patternId } } },
      })
    }
  }

  if (!thread || !isViewer) return null
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="ghost" color="gray" aria-label="More options">
          <Icons.DotsThree size={20} />
        </IconButton>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content variant="soft">
        <DropdownMenu.Item
          onClick={() => {
            navigator.clipboard.writeText(thread._id)
          }}
        >
          <Icons.Copy /> Copy thread ID
        </DropdownMenu.Item>

        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger disabled={patterns.length === 0}>
            <Icons.Robot />
            Patterns
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            {patterns?.map((pattern) => (
              <DropdownMenu.CheckboxItem
                key={pattern.xid}
                checked={pattern.xid === currentPatternId}
                onCheckedChange={() => handlePatternChange(pattern.xid)}
              >
                {pattern.name}
              </DropdownMenu.CheckboxItem>
            ))}
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
