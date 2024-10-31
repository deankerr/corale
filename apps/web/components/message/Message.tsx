'use client'

import type { Message as MessageType } from '@corale/backend'
import { MessageBody } from './MessageBody'
import { MessageFooter } from './MessageFooter'
import { MessageHeader } from './MessageHeader'
import { MessageProvider } from './MessageProvider'

export const Message = ({ message }: { message: MessageType }) => {
  return (
    <MessageProvider message={message}>
      <div className="bg-gray-2 flex shrink-0 flex-col overflow-hidden rounded border" style={{ contain: 'paint' }}>
        <MessageHeader />
        <MessageBody />
        <MessageFooter />
      </div>
    </MessageProvider>
  )
}
