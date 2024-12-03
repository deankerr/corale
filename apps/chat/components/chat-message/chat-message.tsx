import type { Doc } from '@corale/chat-server/dataModel'
import { MarkdownRenderer } from '@corale/ui/components/ui/markdown-renderer'
import { Button } from '@ui/components/ui/button'
import { ChatMessageMenu } from './chat-message-menu'

export const ChatMessage = ({ message }: { message: Doc<'messages'> }) => {
  return (
    <div className="grid grid-cols-[8rem_1fr_8rem]">
      <div className="relative flex flex-col items-start px-3 pt-2">
        <Button variant="outline" className="w-full font-mono uppercase">
          {getRoleName(message.role)}
        </Button>

        <div className="absolute right-4 top-3 font-mono text-xs text-gray-300">{message.sequence}</div>
      </div>

      <div className="flex flex-1 flex-col items-stretch overflow-hidden px-3 py-2">
        <MarkdownRenderer>{message.text ?? ''}</MarkdownRenderer>
      </div>

      <div className="px-3 pt-2">
        <ChatMessageMenu message={message} />
      </div>
    </div>
  )
}

function getRoleColor(role: string) {
  if (role === 'user') return 'grass'
  if (role === 'assistant') return 'orange'
  if (role === 'system') return 'amber'
  return 'gray'
}

function getRoleName(role: string) {
  if (role === 'user') return 'User'
  if (role === 'assistant') return 'AI'
  if (role === 'system') return 'System'
  return role
}
