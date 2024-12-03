import { api } from '@corale/chat-server/api'
import type { Doc } from '@corale/chat-server/dataModel'
import { Button } from '@ui/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/components/ui/dropdown-menu'
import { useCopyToClipboard } from '@ui/hooks/use-copy-to-clipboard'
import { useMutation } from 'convex/react'
import { CopyIcon, MoreVerticalIcon, TrashIcon } from 'lucide-react'

export const ChatMessageMenu = ({ message }: { message: Doc<'messages'> }) => {
  const deleteMessage = useMutation(api.chat.db.deleteMessage)
  const { handleCopy } = useCopyToClipboard({
    text: message._id,
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleCopy}>
          <CopyIcon className="" />
          Copy Message ID
        </DropdownMenuItem>
        <DropdownMenuItem onClick={async () => await deleteMessage({ messageId: message._id })}>
          <TrashIcon className="" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
