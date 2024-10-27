import { useDeleteMessage, useRun, useUpdateMessage } from '@/lib/api/threads'
import { useViewer } from '@/lib/api/users'
import type { Message as MessageType, Run } from '@corale/api/convex/entities/types'
import React, { createContext, useCallback, useContext, useState } from 'react'
import { toast } from 'sonner'

type EMessageUpdateFields = Partial<Pick<MessageType, 'role' | 'name' | 'text' | 'channel'>>

type MessageContextType = {
  message: MessageType
  run?: Run | null
  isEditing: boolean
  showJson: boolean
  textStyle: 'markdown' | 'monospace'
  viewerCanEdit: boolean
  setIsEditing: (value: boolean) => void
  setShowJson: (value: boolean) => void
  setTextStyle: (value: 'markdown' | 'monospace') => void
  updateMessage: (fields: EMessageUpdateFields) => Promise<void>
  deleteMessage: () => Promise<void>
}

const MessageContext = createContext<MessageContextType | undefined>(undefined)

export function MessageProvider({ children, message }: { children: React.ReactNode; message: MessageType }) {
  const [isEditing, setIsEditing] = useState(false)
  const [showJson, setShowJson] = useState(false)
  const [textStyle, setTextStyle] = useState<'markdown' | 'monospace'>('markdown')
  const { isViewer: viewerCanEdit } = useViewer(message.userId)

  const messageId = message.xid
  const run = useRun(message.runId)

  const sendUpdateMessage = useUpdateMessage()
  const updateMessage = useCallback(
    async (fields: EMessageUpdateFields) => {
      try {
        await sendUpdateMessage({
          messageId,
          fields,
        })
        setIsEditing(false)
        toast.success('Message updated')
      } catch (error) {
        toast.error('Failed to update message')
        console.error('Error updating message:', error)
      }
    },
    [messageId, sendUpdateMessage],
  )

  const sendDeleteMessage = useDeleteMessage()
  const deleteMessage = useCallback(async () => {
    try {
      await sendDeleteMessage({ messageId })
      toast.success('Message deleted')
    } catch (error) {
      toast.error('Failed to delete message')
      console.error('Error deleting message:', error)
    }
  }, [messageId, sendDeleteMessage])

  const value = {
    message,
    run,
    isEditing,
    showJson,
    textStyle,
    viewerCanEdit,
    setIsEditing,
    setShowJson,
    setTextStyle,
    updateMessage,
    deleteMessage,
  }

  return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
}

export function useMessageContext() {
  const context = useContext(MessageContext)
  if (context === undefined) {
    throw new Error('useMessage must be used within a MessageProvider')
  }
  return context
}
