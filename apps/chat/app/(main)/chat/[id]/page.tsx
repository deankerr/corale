import { ChatThread } from '@/components/chat-thread/chat-thread'
import { Id } from '@corale/chat-server/dataModel'

export default function Page({ params }: { params: { id: Id<'threads'> } }) {
  return (
    <>
      <ChatThread threadId={params.id} />
    </>
  )
}
