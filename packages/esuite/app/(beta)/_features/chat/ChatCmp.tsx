'use client'

import { ChatMenu } from '@/components/chat/ChatMenu'
import { ModelPickerCmd } from '@/components/command/ModelPickerCmd'
import { ModelLogo } from '@/components/icons/ModelLogo'
import { Message } from '@/components/message/Message'
import { Button, IconButton } from '@/components/ui/Button'
import { SidebarTrigger } from '@/components/ui/Sidebar'
import { TextArea } from '@/components/ui/TextArea'
import { useThreadActions } from '@/lib/api/actions'
import { useMessageFeedQuery } from '@/lib/api/messages'
import { useChatModel } from '@/lib/api/models'
import { useThread } from '@/lib/api/threads'
import { twx } from '@/lib/utils'
import type { ThreadWithDetails } from '@corale/api'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { useState } from 'react'
import { PageHeader, PageLayout } from '../../_ui/PageLayout'
import { RunButton } from './RunButton'

const ChatShell = twx.div`flex h-full min-w-[28rem] w-full flex-col overflow-hidden bg-gray-1`

export function ChatCmp({ threadId }: { threadId: string }) {
  const thread = useThread(threadId)

  if (!thread) {
    if (thread === null) return <ChatShell>ThreadWithDetails not found</ChatShell>
    return <ChatShell>Loading...</ChatShell>
  }

  return (
    <PageLayout header={<ChatHeader thread={thread} />}>
      <ChatBody thread={thread} />
      <ChatFooter thread={thread} />
    </PageLayout>
  )
}

const ChatHeader = ({ thread }: { thread: ThreadWithDetails }) => {
  return (
    <PageHeader>
      <SidebarTrigger />

      <Icons.Chat />
      <span className="text-sm font-medium">{thread.title ?? 'Untitled'}</span>
      <ChatMenu threadId={thread.xid} />
    </PageHeader>
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
    <div className="flex-center bg-gray-1 shrink-0 px-3 pb-2 pt-1">
      <ChatComposer thread={thread} />
    </div>
  )
}

const ChatComposer = ({ thread }: { thread: ThreadWithDetails }) => {
  const [modelId, setModelId] = useState(thread.model?.modelId ?? '')
  const [textValue, setTextValue] = useState('')

  const model = useChatModel(modelId)

  const actions = useThreadActions(thread?._id ?? '', 'xsb/chats')
  const loading = actions.state !== 'ready'

  const handleSend = (action: 'append' | 'run') => {
    if (!modelId) return console.error('No model selected')

    actions
      .send({
        text: textValue,
        model: { provider: 'openrouter', id: modelId },
        action,
      })
      .then((result) => {
        console.log(result)
        if (result !== null) setTextValue('')
      })
      .catch((err) => console.error(err))
  }

  return (
    <div className="bg-black-a1 w-full max-w-2xl overflow-hidden rounded-md border pt-1">
      <TextArea
        placeholder="Type a message..."
        value={textValue}
        onValueChange={setTextValue}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            handleSend('run')
          }
        }}
      />

      <div className="flex-start px-3 pb-3 pt-1.5">
        <ModelPickerCmd modelId={modelId} onModelIdChange={setModelId}>
          <Button color="gray" variant="soft">
            <ModelLogo modelName={model?.name ?? ''} />
            {model?.name || 'Select model'}
          </Button>
        </ModelPickerCmd>

        <div className="grow" />
        <div className="flex-end gap-2">
          <IconButton
            color="gray"
            variant="surface"
            aria-label="Add message"
            onClick={() => handleSend('append')}
            loading={loading}
          >
            <Icons.Plus />
          </IconButton>
          <RunButton onClick={() => handleSend('run')} loading={loading} />
        </div>
      </div>
    </div>
  )
}
