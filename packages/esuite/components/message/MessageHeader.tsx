import { cn } from '@/lib/utils'
import type { Message as MessageType } from '@corale/api/convex/entities/types'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Code, DropdownMenu } from '@radix-ui/themes'
import Link from 'next/link'
import { IconButton } from '../ui/Button'
import { useMessageContext } from './MessageProvider'
import { TimeSince } from './TimeSince'

export const MessageHeader = () => {
  const {
    message,
    updateMessage,
    deleteMessage,
    isEditing,
    showJson,
    setShowJson,
    setIsEditing,
    viewerCanEdit,
    textStyle,
    setTextStyle,
  } = useMessageContext()

  const isHidden = message.channel === 'hidden'

  const handleToggleHidden = () => {
    updateMessage({ channel: isHidden ? '' : 'hidden' })
  }

  const color = getRoleColor(message.role)
  const name = getName(message)
  const hasSVG = message.text?.includes('```svg\n<svg')

  return (
    <div
      className={cn(
        'border-gray-a3 bg-gray-a2 flex h-12 shrink-0 items-center gap-1 border-b p-2.5',
        isHidden && 'opacity-60',
      )}
    >
      <div className="flex-start gap-2">
        {message.channel && (
          <Code color="amber" className="whitespace-pre px-1.5 uppercase" size="3">
            {message.channel}
          </Code>
        )}

        <Code color={color} className="whitespace-pre px-1.5 uppercase" size="3">
          {message.role}
        </Code>
        <div className="text-gray-11 font-medium">{name}</div>
      </div>

      <div className="grow" />
      {hasSVG && (
        <Link href={`/drawing/${message._id}`} target="_blank">
          <IconButton variant="ghost" size="1" aria-label="Open SVG">
            <Icons.Graph size={18} />
          </IconButton>
        </Link>
      )}

      <div className="flex-center text-gray-10 gap-1 font-mono">
        <TimeSince time={Math.floor(message._creationTime)} />
        <div>⋅</div>
        <div>#{message.series}</div>
      </div>

      <IconButton
        variant="ghost"
        color="gray"
        size="1"
        aria-label="Copy message"
        onClick={() => navigator.clipboard.writeText(message.text ?? '')}
        disabled={!message.text}
      >
        <Icons.Copy size={18} />
      </IconButton>

      <IconButton
        variant="ghost"
        color={textStyle === 'markdown' ? 'orange' : 'gray'}
        size="1"
        aria-label="Toggle Markdown view"
        onClick={() => setTextStyle(textStyle === 'markdown' ? 'monospace' : 'markdown')}
      >
        <Icons.MarkdownLogo size={18} />
      </IconButton>

      {viewerCanEdit && (
        <IconButton
          variant="ghost"
          color={isEditing ? 'orange' : 'gray'}
          size="1"
          aria-label="Edit"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Icons.Pencil size={18} />
        </IconButton>
      )}

      <IconButton
        variant="ghost"
        color={isHidden ? 'orange' : 'gray'}
        size="1"
        aria-label="Hide"
        onClick={handleToggleHidden}
        disabled={!viewerCanEdit}
      >
        {isHidden ? <Icons.EyeClosed size={18} /> : <Icons.Eye size={18} />}
      </IconButton>

      {viewerCanEdit && (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton variant="ghost" color="gray" size="1" aria-label="Delete">
              <Icons.Trash size={18} />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content variant="soft">
            <DropdownMenu.Item color="red" onClick={deleteMessage}>
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )}

      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton variant="ghost" color="gray" size="1" aria-label="More">
            <Icons.DotsThree size={18} className="scale-150" />
          </IconButton>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content variant="soft">
          {/* TODO: use xid */}
          <Link href={`/chats/${message.threadId}/${message.series}`}>
            <DropdownMenu.Item>
              <Icons.Share /> Link
            </DropdownMenu.Item>
          </Link>
          <DropdownMenu.Item
            onClick={() => {
              navigator.clipboard.writeText(message._id)
            }}
          >
            <Icons.Copy /> Copy message ID
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => setShowJson(!showJson)}>
            <Icons.Code />
            Show JSON
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}

function getRoleColor(role: string) {
  if (role === 'user') return 'grass'
  if (role === 'assistant') return 'orange'
  return 'gray'
}

function getName(message: MessageType) {
  if (message.name) return message.name

  if (message.role === 'assistant') {
    return message.kvMetadata?.['esuite:run:model:name']
  }
}
