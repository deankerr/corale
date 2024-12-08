import { api } from '@corale/chat-server/api'
import type { Doc } from '@corale/chat-server/dataModel'
import { MarkdownRenderer } from '@corale/ui/components/ui/markdown-renderer'
import { LoaderPing } from '@ui/components/loaders/loader-ping'
import { LoaderRipples } from '@ui/components/loaders/loader-ripples'
import { Button } from '@ui/components/ui/button'
import { AppLogoIcon } from '@ui/icons/AppLogoIcon'
import { cn } from '@ui/lib/utils'
import { useMutation } from 'convex/react'
import { ParenthesesIcon } from 'lucide-react'
import { ChatMessageMenu } from './chat-message-menu'

export const ChatMessage = ({ message }: { message: Doc<'messages'> }) => {
  const showMessagesFrom = useMutation(api.chat.db.showMessagesFrom)

  return (
    <div className="flex w-full min-w-0">
      <div className="relative flex w-20 flex-none flex-col items-center pt-0.5">
        <ChatMessageAvatar role={message.role} isPending={!message.text} isStreaming={false} />
      </div>

      <div className="min-w-0 flex-1 px-1">
        <div className="mb-1 font-mono text-xs text-[hsl(var(--rx-gold-7))]">
          <span className="text-gray-400">
            {message.sequence} {message.branch} {message.branchSequence}
          </span>{' '}
          {message.data.modelId}
        </div>

        <div className="grid">
          <MarkdownRenderer>{message.text ?? ''}</MarkdownRenderer>
        </div>
      </div>

      <div className="grid flex-none pl-1">
        <ChatMessageMenu message={message} />
        <Button variant="outline" size="icon" onClick={() => showMessagesFrom({ messageId: message._id })}>
          <ParenthesesIcon />
        </Button>
      </div>
    </div>
  )
}

const gold7 = 'hsl(40deg 24.1% 73.1%)'
const gold11 = 'hsl(36deg 20.2% 36.9%)'

const ChatMessageAvatar = ({
  role,
  isPending,
  isStreaming,
}: {
  role: string
  isPending: boolean
  isStreaming: boolean
}) => {
  let icon = (
    <div className="w-full rounded-full bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-orange-300 to-orange-700" />
  )
  let style = 'text-orange-500'

  if (role === 'assistant') {
    style = 'text-[hsl(var(--rx-gold-9))]'
    if (isPending) icon = <LoaderPing />
    else if (isStreaming) icon = <LoaderRipples />
    else icon = <AppLogoIcon className="w-full" gradientType="radial" stopColor1={gold7} stopColor2={gold11} />
  }

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-1.5 rounded-sm', style)}>
      <div className="flex size-10">{icon}</div>
      <div className="font-mono text-sm font-semibold uppercase">{getRoleName(role)}</div>
    </div>
  )
}

function getRoleName(role: string) {
  if (role.toLowerCase() === 'user') return 'User'
  if (role.toLowerCase() === 'assistant') return 'AI'
  if (role.toLowerCase() === 'system') return 'System'
  return role
}
