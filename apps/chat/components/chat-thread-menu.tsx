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

export const ChatThreadMenu = ({ thread }: { thread: Doc<'threads'> }) => {
  const deleteThread = useMutation(api.chat.db.deleteThread)
  const { handleCopy } = useCopyToClipboard({
    text: thread._id,
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleCopy}>
          <CopyIcon className="" />
          Copy Thread ID
        </DropdownMenuItem>
        <DropdownMenuItem onClick={async () => await deleteThread({ threadId: thread._id })}>
          <TrashIcon className="" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
