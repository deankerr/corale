import type { Doc } from '@corale/chat-server/dataModel'
import { MarkdownRenderer } from '@corale/ui/components/ui/markdown-renderer'
import { LoaderPing } from '@ui/components/loaders/loader-ping'
import { LoaderRipples } from '@ui/components/loaders/loader-ripples'
import { AppLogoIcon } from '@ui/icons/AppLogoIcon'
import { cn } from '@ui/lib/utils'
import { ChatMessageMenu } from './chat-message-menu'

export const ChatMessage = ({ message }: { message: Doc<'messages'> }) => {
  return (
    <div className="grid grid-cols-[auto_1fr_auto]">
      <div className="relative flex flex-col items-end px-3 pt-1">
        <ChatMessageAvatar role={message.role} isPending={!message.text} isStreaming={false} />
      </div>

      <div className="flex flex-1 flex-col items-stretch overflow-hidden px-1 py-2 text-[15px]">
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
  let icon = <div className="size-7 rounded-full bg-current" />
  let style = ''

  if (role === 'assistant') {
    style = 'text-[hsl(var(--rx-gold-9))]'
    if (isPending) icon = <LoaderPing />
    else if (isStreaming) icon = <LoaderRipples />
    else icon = <AppLogoIcon className="size-7" />
  }

  return (
    <div className={cn('flex flex-col items-center justify-center', style)}>
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
