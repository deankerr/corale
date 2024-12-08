import { api } from '@corale/chat-server/api'
import type { Doc } from '@corale/chat-server/dataModel'
import { Button } from '@ui/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/components/ui/dropdown-menu'
import { useCopyToClipboard } from '@ui/hooks/use-copy-to-clipboard'
import { useMutation } from 'convex/react'
import { CopyIcon, MoreVerticalIcon, Recycle, TrashIcon } from 'lucide-react'

export const ChatMessageMenu = ({ message }: { message: Doc<'messages'> }) => {
  const deleteMessage = useMutation(api.chat.db.deleteMessage)
  const regenerate = useMutation(api.chat.db.regenerate)

  const { handleCopy } = useCopyToClipboard({
    text: message._id,
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>Message #{message.sequence}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopy}>
          <CopyIcon className="" />
          Copy Message ID
        </DropdownMenuItem>

        {message.role === 'assistant' && message.text && (
          <DropdownMenuItem
            onClick={() => {
              regenerate({ messageId: message._id })
            }}
          >
            <Recycle />
            Regenerate
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={async () => await deleteMessage({ messageId: message._id })}>
          <TrashIcon className="" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
