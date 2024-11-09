import { Message } from '@/components/message/Message'
import type { useMessageFeed } from '@/lib/api/messages'

export const MessageFeed = ({ messages }: { messages: ReturnType<typeof useMessageFeed> }) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 text-sm">
      {messages.results.map((message) => (
        <div className="mx-auto max-w-2xl py-2" key={message._id}>
          <Message message={message} />
        </div>
      ))}

      {messages.status === 'LoadingFirstPage' && <div className="flex-col-center h-full w-full">Loading...</div>}
    </div>
  )
}
