import { Message } from '@/components/message/Message'
import type { useMessageFeed } from '@/lib/api/messages'

export const MessageFeed = ({ messages }: { messages: ReturnType<typeof useMessageFeed> }) => {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3">
      {messages.results.map((message) => (
        <Message message={message} key={message._id} />
      ))}

      {messages.status === 'LoadingFirstPage' && <div className="flex-col-center h-full w-full">Loading...</div>}
    </div>
  )
}
