'use client'

import { useThread } from '@/app/lib/api/threads'
import { DeleteThreadDialog, EditThreadTitleDialog } from '@/components/chat/dialogs'
import { DotsThreeFillX } from '@/components/icons/DotsThreeFillX'
import { IconButton } from '@/components/ui/Button'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { DropdownMenu } from '@radix-ui/themes'
import { useState } from 'react'

export const ChatMenu = ({ threadId }: { threadId: string }) => {
  const thread = useThread(threadId)

  const [showEditTitleDialog, setShowEditTitleDialog] = useState(false)
  const [showDeleteThreadDialog, setShowDeleteThreadDialog] = useState(false)

  if (!thread || !thread.user.isViewer) {
    return null
  }

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton variant="ghost" color="gray" aria-label="More options">
            <DotsThreeFillX width={20} height={20} />
          </IconButton>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content variant="soft">
          <DropdownMenu.Item
            onClick={() => {
              navigator.clipboard.writeText(thread._id)
            }}
          >
            <Icons.Copy /> Copy thread ID
          </DropdownMenu.Item>

          <DropdownMenu.Item onClick={() => setShowEditTitleDialog(true)}>
            <Icons.Pencil /> Edit title
          </DropdownMenu.Item>

          <DropdownMenu.Item color="red" onClick={() => setShowDeleteThreadDialog(true)}>
            <Icons.Trash /> Delete thread
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <EditThreadTitleDialog
        threadId={thread._id}
        currentTitle={thread.title ?? ''}
        open={showEditTitleDialog}
        onOpenChange={setShowEditTitleDialog}
      />

      <DeleteThreadDialog
        threadId={thread._id}
        open={showDeleteThreadDialog}
        onOpenChange={setShowDeleteThreadDialog}
      />
    </>
  )
}
