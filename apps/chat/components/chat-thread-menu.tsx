import { api } from '@corale/chat-server/api'
import type { Id } from '@corale/chat-server/dataModel'
import { Button } from '@ui/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@ui/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/components/ui/dropdown-menu'
import { Input } from '@ui/components/ui/input'
import { Label } from '@ui/components/ui/label'
import { useCopyToClipboard } from '@ui/hooks/use-copy-to-clipboard'
import { useMutation } from 'convex/react'
import { CopyIcon, EditIcon, MoreVerticalIcon, TrashIcon } from 'lucide-react'
import { useState } from 'react'
import { useChatContext } from './chat-thread/chat-thread'

export const ChatThreadMenu = () => {
  const { threadId, title } = useChatContext()

  const deleteThread = useMutation(api.chat.db.deleteThread)
  const { handleCopy } = useCopyToClipboard({
    text: threadId,
  })

  return (
    <DropdownMenu modal={false}>
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
        <EditThreadTitleDialog threadId={threadId} title={title}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <EditIcon className="" />
            Edit Title
          </DropdownMenuItem>
        </EditThreadTitleDialog>
        <DropdownMenuItem onClick={async () => await deleteThread({ threadId })}>
          <TrashIcon className="" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const EditThreadTitleDialog = ({
  threadId,
  title,
  children,
}: {
  threadId: Id<'threads'>
  title: string
  children: React.ReactNode
}) => {
  const [value, setValue] = useState(title)
  const updateThread = useMutation(api.chat.db.updateThread)
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Thread Title</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Title
            </Label>
            <Input id="link" defaultValue={title} value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="default" onClick={() => updateThread({ threadId, thread: { title: value } })}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
