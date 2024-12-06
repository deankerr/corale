import { ChatThread } from '@/components/chat-thread/chat-thread'
import { Id } from '@corale/chat-server/dataModel'

export default function Page() {
  return <ChatThread threadId={'new' as Id<'threads'>} />
}
