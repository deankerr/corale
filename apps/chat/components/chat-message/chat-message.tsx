import type { Doc } from '@corale/chat-server/dataModel'
import { MarkdownRenderer } from '@corale/ui/components/ui/markdown-renderer'
import { LoaderPing } from '@ui/components/loaders/loader-ping'
import { LoaderRipples } from '@ui/components/loaders/loader-ripples'
import { AppLogoIcon } from '@ui/icons/AppLogoIcon'
import { cn } from '@ui/lib/utils'
import { ChatMessageMenu } from './chat-message-menu'

export const ChatMessage = ({ message }: { message: Doc<'messages'> }) => {
  return (
    <div className="grid grid-cols-[minmax(min-content,5rem)_1fr_minmax(min-content,5rem)]">
      <div className="relative flex flex-col items-end pr-3.5">
        <ChatMessageAvatar role={message.role} isPending={!message.text} isStreaming={false} />
      </div>

      <div className="flex flex-1 flex-col items-stretch overflow-hidden px-1 py-1 text-[15px]">
        <MarkdownRenderer>{message.text ?? ''}</MarkdownRenderer>
      </div>

      <div className="px-1 pt-1">
        <ChatMessageMenu message={message} />
      </div>
    </div>
  )
}

const ChatMessageAvatar = ({
  role,
  isPending,
  isStreaming,
}: {
  role: string
  isPending: boolean
  isStreaming: boolean
}) => {
  let icon = <div className="size-7 rounded-full bg-gradient-to-tl from-orange-600 to-orange-400" />
  let style = 'text-orange-500'

  if (role === 'assistant') {
    style = 'text-[hsl(var(--rx-gold-10))]'
    if (isPending) icon = <LoaderPing />
    else if (isStreaming) icon = <LoaderRipples />
    else icon = <AppLogoIcon className="size-7" />
  }

  return (
    <div className={cn('flex flex-col items-center justify-center rounded-sm', style)}>
      <div className="grid size-12 place-content-center">{icon}</div>
      <div className="font-mono text-sm uppercase">{getRoleName(role)}</div>
    </div>
  )
}

function getRoleName(role: string) {
  if (role.toLowerCase() === 'user') return 'User'
  if (role.toLowerCase() === 'assistant') return 'AI'
  if (role.toLowerCase() === 'system') return 'System'
  return role
}
