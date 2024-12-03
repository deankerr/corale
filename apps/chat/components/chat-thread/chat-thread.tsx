'use client'

import { ChatThreadMenu } from '@/components/chat-thread-menu'
import { Composer } from '@/components/composer/composer'
import { Panel, PanelContent, PanelHeader } from '@/components/layout/panel'
import { api } from '@corale/chat-server/api'
import { Id } from '@corale/chat-server/dataModel'
import { Button } from '@ui/components/ui/button'
import { useMutation, useQuery } from 'convex/react'
import { MessageCircleIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { TextareaAutosize } from '../textarea-autosize'
import { MessageFeed } from './message-feed'

export const ChatThread = (props: { threadId: Id<'threads'> }) => {
  const isNewThread = props.threadId === 'new'
  const router = useRouter()

  const thread = useQuery(api.chat.db.getThread, isNewThread ? 'skip' : { threadId: props.threadId })
  const [instructions, setInstructions] = useState(thread?.run?.instructions)

  const createThread = useMutation(api.chat.db.createThread)
  const createMessage = useMutation(api.chat.db.createMessage)
  const runThread = useMutation(api.chat.db.runThread)

  const handleSend = async (args: { text: string; model?: string }) => {
    const threadId = isNewThread ? await createThread({}) : props.threadId
    const message = args.text ? { text: args.text, role: 'user' as const } : undefined
    const run = { modelId: args.model || undefined, instructions: instructions || undefined }

    if (message) {
      await createMessage({
        threadId,
        message,
        run,
      })
    } else {
      await runThread({ threadId, run })
    }

    if (isNewThread) router.push(`/chat/${threadId}`)
  }

  return (
    <Panel>
      <PanelHeader className="justify-center shadow-sm">
        <MessageCircleIcon className="size-4" /> {thread?.title}
        {thread && <ChatThreadMenu thread={thread} />}
      </PanelHeader>

      <PanelContent>
        <div className="mx-auto mb-3 w-full max-w-5xl">
          <div className="grid grid-cols-[8rem_1fr_8rem]">
            <div className="px-3 pt-2.5 text-center font-mono text-sm uppercase">Instructions</div>

            <div className="flex flex-1 flex-col items-stretch overflow-hidden px-3 py-2">
              <TextareaAutosize value={instructions} onChange={(e) => setInstructions(e.target.value)} />
            </div>

            <div className="px-3 pt-2">
              <Button variant="outline" size="icon">
                <MessageCircleIcon />
              </Button>
            </div>
          </div>
        </div>

        {!isNewThread && <MessageFeed threadId={props.threadId} />}
      </PanelContent>

      <div className="mx-auto w-full max-w-3xl p-3">
        <Composer onSend={handleSend} />
      </div>
    </Panel>
  )
}
