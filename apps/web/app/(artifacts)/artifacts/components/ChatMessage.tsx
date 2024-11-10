import { Markdown } from '@/components/markdown/Markdown'
import type { Message } from '@corale/backend'
import { Badge } from '@radix-ui/themes'

export const ChatMessage = ({ message }: { message: Message }) => {
  return (
    <div className="flex w-full gap-3">
      <div className="flex-col-start w-16">
        <div className="bg-gray-1">
          <Badge
            className="flex-center min-h-9 border border-transparent font-mono uppercase leading-relaxed"
            color={getRoleColor(message.role)}
            size="3"
          >
            {getRoleName(message.role)}
          </Badge>
        </div>

        {message.channel && <Badge className="flex-center font-mono uppercase">{message.channel}</Badge>}
      </div>
      <div className="bg-gray-2 flex flex-1 flex-col items-stretch rounded border border-transparent px-3 py-1.5">
        <Markdown>{message.text}</Markdown>
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
