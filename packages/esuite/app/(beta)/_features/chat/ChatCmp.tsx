'use client'

import { Message } from '@/components/message/Message'
import { Button, IconButton } from '@/components/ui/Button'
import { SidebarTrigger } from '@/components/ui/Sidebar'
import { TextArea } from '@/components/ui/TextArea'
import { useMessageFeedQuery } from '@/lib/api/messages'
import { useThread } from '@/lib/api/threads'
import { twx } from '@/lib/utils'
import type { ThreadWithDetails } from '@corale/api'
import * as Icons from '@phosphor-icons/react/dist/ssr'

const ChatShell = twx.div`flex h-full min-w-[28rem] w-full flex-col overflow-hidden bg-gray-1`

export function ChatCmp({ threadId }: { threadId: string }) {
  const thread = useThread(threadId)

  if (!thread) {
    if (thread === null) return <ChatShell>ThreadWithDetails not found</ChatShell>
    return <ChatShell>Loading...</ChatShell>
  }

  return (
    <ChatShell>
      <ChatHeader thread={thread} />
      <ChatBody thread={thread} />
      <ChatFooter thread={thread} />
    </ChatShell>
  )
}

const ChatHeader = ({ thread }: { thread: ThreadWithDetails }) => {
  return (
    <header className="flex-start bg-gray-a2 h-12 shrink-0 gap-2 border-b px-3">
      <SidebarTrigger />

      <span className="text-sm font-medium">{thread.title ?? 'Untitled'}</span>
    </header>
  )
}

const ChatBody = ({ thread }: { thread: ThreadWithDetails }) => {
  return (
    <div className="grid flex-1 grow grid-flow-col overflow-hidden [&>*]:col-start-1 [&>*]:row-start-1">
      <MessageFeed thread={thread} />
    </div>
  )
}

const MessageFeed = ({ thread }: { thread: ThreadWithDetails }) => {
  const messages = useMessageFeedQuery(thread.xid)

  return (
    <div className="flex-1 overflow-y-auto px-3 py-2 text-sm">
      {messages.results.map((message) => (
        <div className="mx-auto max-w-2xl py-2" key={message._id}>
          <Message message={message} />
        </div>
      ))}

      {messages.status === 'LoadingFirstPage' && <div className="flex-col-center h-full w-full">Loading...</div>}
    </div>
  )
}

const ChatFooter = ({ thread }: { thread: ThreadWithDetails }) => {
  return (
    <div className="flex-center bg-gray-1 shrink-0 pb-2 pt-1">
      <ChatComposer thread={thread} />
    </div>
  )
}

const ChatComposer = ({ thread }: { thread: ThreadWithDetails }) => {
  return (
    <div className="bg-black-a1 w-full max-w-2xl overflow-hidden rounded-md border pt-1">
      <TextArea placeholder="Type a message..." />

      <div className="flex-start px-3 pb-3 pt-1.5">
        <Button color="gray" variant="soft">
          {thread.model?.name || 'Select model'}
        </Button>

        <div className="grow" />
        <div className="flex-end gap-2">
          <IconButton color="gray" variant="surface" aria-label="Add message">
            <Icons.Plus />
          </IconButton>
          <Button variant="surface">Run</Button>
        </div>
      </div>
    </div>
  )
}
