import { ChatCmp } from '@/app/(beta)/_features/chat/ChatCmp'

export default function Page({ params }: { params: { threadId: string } }) {
  return <ChatCmp threadId={params.threadId} />
}
