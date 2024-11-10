import { Message } from '@/components/message/Message'
import type { useMessageFeed } from '@/lib/api/messages'
import { ChatMessage } from './ChatMessage'

export const MessageFeed = ({ messages }: { messages: ReturnType<typeof useMessageFeed> }) => {
  return (
    <>
      {messages.results.map((message) => (
        <Message message={message} key={message._id} />
      ))}

      {messages.status === 'LoadingFirstPage' && <div className="flex-col-center h-full w-full">Loading...</div>}
    </>
  )
}
