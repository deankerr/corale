import { api } from '@corale/chat-server/api'
import type { Id } from '@corale/chat-server/dataModel'
import { useQuery } from 'convex/react'
import { ChatMessage } from '../chat-message/chat-message'

export const MessageFeed = ({ threadId }: { threadId: Id<'threads'> }) => {
  const messages = useQuery(api.chat.db.listMessages, { threadId })

  if (!messages) return null
  return (
    <div className="space-y-2">
      {messages.toReversed().map((m) => (
        <div key={m._id} className="mx-auto w-full max-w-5xl">
          <ChatMessage message={m} />
        </div>
      ))}
    </div>
  )
}
