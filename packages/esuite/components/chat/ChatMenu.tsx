'use client'

import { DeleteThreadDialog, EditThreadTitleDialog } from '@/components/chat/dialogs'
import { DotsThreeFillX } from '@/components/icons/DotsThreeFillX'
import { IconButton } from '@/components/ui/Button'
import { useThread } from '@/lib/api/threads'
import { useViewer } from '@/lib/api/users'
import { useRoleQueryParam } from '@/lib/searchParams'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { DropdownMenu } from '@radix-ui/themes'
import { useState } from 'react'

export const ChatMenu = ({ threadId }: { threadId: string }) => {
  const thread = useThread(threadId)
  const { isViewer } = useViewer(thread?.userId)

  const [showEditTitleDialog, setShowEditTitleDialog] = useState(false)
  const [showDeleteThreadDialog, setShowDeleteThreadDialog] = useState(false)

  const [roleQueryParam, setRoleQueryParam] = useRoleQueryParam()

  if (!thread || !isViewer) {
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

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>
              <Icons.Funnel />
              Filter role
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.CheckboxItem
                checked={roleQueryParam === 'user'}
                onCheckedChange={(checked) => setRoleQueryParam(checked ? 'user' : null)}
              >
                <Icons.User /> User
              </DropdownMenu.CheckboxItem>
              <DropdownMenu.CheckboxItem
                checked={roleQueryParam === 'assistant'}
                onCheckedChange={(checked) => setRoleQueryParam(checked ? 'assistant' : null)}
              >
                <Icons.Robot /> Assistant
              </DropdownMenu.CheckboxItem>
              <DropdownMenu.CheckboxItem
                checked={roleQueryParam === 'system'}
                onCheckedChange={(checked) => setRoleQueryParam(checked ? 'system' : null)}
              >
                <Icons.Gear /> System
              </DropdownMenu.CheckboxItem>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>

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
