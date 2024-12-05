'use client'

import { ChatThreadMenu } from '@/components/chat-thread-menu'
import { Composer } from '@/components/composer/composer'
import { Panel, PanelContent, PanelHeader, PanelOverlay, PanelOverlayRegion } from '@/components/layout/panel'
import { api } from '@corale/chat-server/api'
import { Id } from '@corale/chat-server/dataModel'
import { Button } from '@ui/components/ui/button'
import { cn } from '@ui/lib/utils'
import { useMutation, useQuery } from 'convex/react'
import { KeyboardIcon, MessageCircleIcon, SquareCodeIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'
import { TextareaAutosize } from '../textarea-autosize'
import { MessageFeed } from './message-feed'

type ChatContextValue = {
  threadId: Id<'threads'>
  title: string
  modelId?: string
  setModelId: (modelId: string) => void
  instructions?: string
  setInstructions: (instructions: string) => void
  showComposer: boolean
  setShowComposer: (showComposer: boolean) => void
  handleSend: (args: { text: string; model?: string }) => Promise<void>
}

const ChatContext = createContext<ChatContextValue | null>(null)

function useChatContext() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}

function ChatProvider({ threadId, children }: { threadId: Id<'threads'>; children?: React.ReactNode }) {
  const thread = useQuery(api.chat.db.getThread, { threadId })
  const [instructions, setInstructions] = useState(thread?.run?.instructions)
  const [modelId, setModelId] = useState(thread?.run?.modelId)
  const [showComposer, setShowComposer] = useState(true)

  const createThread = useMutation(api.chat.db.createThread)
  const createMessage = useMutation(api.chat.db.createMessage)
  const runThread = useMutation(api.chat.db.runThread)

  const handleSend = async (args: { text: string; model?: string }) => {
    // const threadId = isNewThread ? await createThread({}) : props.threadId
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

    // if (isNewThread) router.push(`/chat/${threadId}`)
  }

  return (
    <ChatContext.Provider
      value={{
        threadId,
        title: thread?.title ?? 'No title',
        modelId,
        instructions,
        setModelId,
        setInstructions,
        showComposer,
        setShowComposer,
        handleSend,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

const ChatHeader = ({ children }: { children?: React.ReactNode }) => {
  const { threadId, title } = useChatContext()

  return (
    <PanelHeader className="justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <MessageCircleIcon className="size-4 shrink-0" />
        <SquareCodeIcon className="size-4 shrink-0" />
      </div>

      <div className="min-w-0">
        <div className="max-w-[60ch] truncate">{title}</div>
      </div>

      <div className="flex items-center gap-2">
        <ChatThreadMenu threadId={threadId} />
        {children}
      </div>
    </PanelHeader>
  )
}

const ChatInstructions = ({ value, onValueChange }: { value?: string; onValueChange: (value: string) => void }) => {
  return (
    <div className="mx-auto mb-3 w-full max-w-3xl">
      <div className="text-muted-foreground mb-1 pl-1 font-mono text-xs uppercase">Instructions</div>
      <TextareaAutosize value={value} onValueChange={onValueChange} />
    </div>
  )
}

const ChatContent = () => {
  const { instructions, setInstructions, threadId } = useChatContext()

  return (
    <PanelContent>
      {instructions && <ChatInstructions value={instructions} onValueChange={setInstructions} />}
      <MessageFeed threadId={threadId} />
    </PanelContent>
  )
}

const ChatComposer = () => {
  const { handleSend, modelId, showComposer } = useChatContext()

  return (
    <PanelOverlay side="bottom" isOpen={showComposer} className="max-w-3xl p-3">
      <Composer onSend={handleSend} defaultModel={modelId} />
    </PanelOverlay>
  )
}

export const ChatThread = (props: { threadId: Id<'threads'> }) => {
  return (
    <ChatProvider threadId={props.threadId}>
      <Panel>
        <ChatHeader />
        <ChatContent />

        <PanelOverlayRegion>
          <ChatComposer />
        </PanelOverlayRegion>
      </Panel>
    </ChatProvider>
  )
}
