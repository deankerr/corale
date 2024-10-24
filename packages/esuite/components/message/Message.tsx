'use client'

import type { EMessage } from '@corale/api/convex/types'
import { MessageBody } from './MessageBody'
import { MessageFooter } from './MessageFooter'
import { MessageHeader } from './MessageHeader'
import { MessageProvider } from './MessageProvider'

export const Message = ({ message }: { message: EMessage }) => {
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
