'use client'

import { DeleteThreadDialog, EditThreadTitleDialog } from '@/components/chat/dialogs'
import { IconButton } from '@/components/ui/Button'
import { Protected } from '@/components/util/Protected'
import { usePatterns } from '@/lib/api/patterns'
import { getThreadMetadata, useUpdateThread } from '@/lib/api/threads'
import { useRoleQueryParam } from '@/lib/searchParams'
import { type Thread } from '@corale/backend'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { DropdownMenu } from '@radix-ui/themes'

export const ChatMenu = ({ thread }: { thread: Thread }) => {
  const patterns = usePatterns() ?? []
  const metadata = getThreadMetadata(thread)

  const [roleQueryParam, setRoleQueryParam] = useRoleQueryParam()

  const updateThread = useUpdateThread()
  const handlePatternChange = (patternId: string) => {
    updateThread({
      threadId: thread._id,
      fields: {
        kvMetadata:
          patternId === metadata.patternId
            ? { delete: ['esuite:pattern:xid'] }
            : { set: { 'esuite:pattern:xid': patternId } },
      },
    }).catch(console.error)
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="ghost" color="gray" aria-label="More options">
          <Icons.DotsThree />
        </IconButton>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content variant="soft">
        <DropdownMenu.Item
          onClick={() => {
            navigator.clipboard.writeText(thread._id)
          }}
        >
          <Icons.Copy /> Copy ID
        </DropdownMenu.Item>

        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>
            <Icons.Funnel />
            Role
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

        <Protected isUser={thread.userId}>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger disabled={patterns.length === 0}>
              <Icons.Robot />
              Patterns
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              {patterns?.map((pattern) => (
                <DropdownMenu.CheckboxItem
                  key={pattern.xid}
                  checked={pattern.xid === metadata.patternId}
                  onCheckedChange={() => handlePatternChange(pattern.xid)}
                >
                  {pattern.name}
                </DropdownMenu.CheckboxItem>
              ))}
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>

          <EditThreadTitleDialog threadId={thread._id} currentTitle={thread.title ?? ''}>
            <DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
              <Icons.Pencil /> Edit Title
            </DropdownMenu.Item>
          </EditThreadTitleDialog>

          <DeleteThreadDialog threadId={thread._id}>
            <DropdownMenu.Item color="red" onSelect={(e) => e.preventDefault()}>
              <Icons.Trash /> Delete
            </DropdownMenu.Item>
          </DeleteThreadDialog>
        </Protected>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
