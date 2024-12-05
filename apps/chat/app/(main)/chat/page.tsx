import { ChatThreadLegacy } from '@/components/chat-thread/chat-thread'
import { Id } from '@corale/chat-server/dataModel'

export default function Page() {
  return <ChatThreadLegacy threadId={'new' as Id<'threads'>} />
}
