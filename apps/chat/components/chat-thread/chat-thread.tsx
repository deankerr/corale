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
import { createContext, useContext, useState } from 'react'
import { TextareaAutosize } from '../textarea-autosize'
import { MessageFeed } from './message-feed'
import { clearInputAtom, readInputAtom, useInputAtom } from './store'

type ChatContextValue = {
  threadId: Id<'threads'>
  title: string
  modelId?: string
  instructions?: string
  setModelId: (modelId: string) => void
  showComposer: boolean
  setShowComposer: (showComposer: boolean) => void
  handleSend: (args: { text: string; model?: string }) => Promise<void>
}

const ChatContext = createContext<ChatContextValue | null>(null)

export function useChatContext() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}

type ChatProviderProps = {
  threadId: Id<'threads'>
  title: string
  initialModelId?: string
  initialInstructions?: string
  children?: React.ReactNode
}

function ChatProvider({ children, ...props }: ChatProviderProps) {
  const [modelId, setModelId] = useState(props.initialModelId)
  const [showComposer, setShowComposer] = useState(true)

  const createThread = useMutation(api.chat.db.createThread)
  const createMessage = useMutation(api.chat.db.createMessage)
  const runThread = useMutation(api.chat.db.runThread)
  const router = useRouter()

  const handleSend = async (args: { text: string; model?: string }) => {
    const message = args.text ? { text: args.text, role: 'user' as const } : undefined
    const run = args.model
      ? { modelId: args.model || undefined, instructions: readInputAtom(props.threadId, 'instructions') }
      : undefined

    const threadId = props.threadId === 'new' ? await createThread({}) : props.threadId

    if (message) {
      await createMessage({
        threadId,
        message,
        run,
      })
    } else if (run) {
      await runThread({ threadId, run })
    }

    if (props.threadId === 'new') {
      clearInputAtom('new', 'instructions')
      router.push(`/chat/${threadId}`)
    }
  }

  return (
    <ChatContext.Provider
      value={{
        threadId: props.threadId,
        title: props.title,
        instructions: props.initialInstructions,
        modelId,
        setModelId,
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
  const { threadId, title, showComposer, setShowComposer } = useChatContext()

  return (
    <PanelHeader className="justify-between shadow-sm">
      <div className="flex shrink-0 items-center gap-2">
        <MessageCircleIcon className="size-4" />
        <SquareCodeIcon className="size-4" />
      </div>

      <div className="min-w-0">
        <div className="max-w-[60ch] truncate">{title}</div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => setShowComposer(!showComposer)}>
          <KeyboardIcon className={cn('size-4', !showComposer && 'brightness-50')} />
        </Button>
        <ChatThreadMenu />
        {children}
      </div>
    </PanelHeader>
  )
}

const ChatInstructions = () => {
  const { threadId, instructions } = useChatContext()
  const [value, setValue] = useInputAtom(threadId, 'instructions', instructions)

  return (
    <div className="mx-auto mb-3 w-full max-w-3xl">
      <div className="text-muted-foreground mb-1 pl-1 font-mono text-sm uppercase">Instructions</div>
      <TextareaAutosize value={value} onValueChange={setValue} />
    </div>
  )
}

const ChatContent = () => {
  const { threadId, showComposer } = useChatContext()

  return (
    <PanelContent>
      <ChatInstructions />
      {threadId !== 'new' && <MessageFeed threadId={threadId} />}
      {showComposer && <div className="h-32" />}
    </PanelContent>
  )
}

const ChatComposer = () => {
  const { handleSend, modelId, showComposer, threadId } = useChatContext()

  return (
    <PanelOverlay side="bottom" isOpen={showComposer} className="max-w-3xl p-3">
      <Composer threadId={threadId} onSend={handleSend} defaultModel={modelId} />
    </PanelOverlay>
  )
}

export const ChatThread = ({ threadId }: { threadId: Id<'threads'> }) => {
  const thread = useQuery(api.chat.db.getThread, threadId !== 'new' ? { threadId } : 'skip')

  // New thread state
  if (threadId === 'new') {
    return (
      <ChatProvider threadId={threadId} title="New">
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

  // Loading state
  if (thread === undefined) {
    return (
      <Panel>
        <div className="flex h-full items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </Panel>
    )
  }

  // Error state (thread not found)
  if (thread === null) {
    return (
      <Panel>
        <div className="flex h-full items-center justify-center">
          <div className="text-muted-foreground">Thread not found</div>
        </div>
      </Panel>
    )
  }

  // Existing thread state
  return (
    <ChatProvider
      threadId={threadId}
      title={thread.title ?? 'Untitled'}
      initialModelId={thread.run?.modelId}
      initialInstructions={thread.run?.instructions}
    >
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
