'use client'

import { useThread } from '@/app/lib/api/threads'
import { TextEditorDialog } from '@/components/text-document-editor/TextEditorDialog'
import { Button } from '@/components/ui/Button'
import { PanelToolbar } from '@/components/ui/Panel'

export const ChatToolbar = ({ threadId }: { threadId: string }) => {
  const thread = useThread(threadId ?? '')
  if (!thread) return null

  const kv = Object.entries(thread.kvMetadata)
  return (
    <PanelToolbar className="bg-grayA-1 pl-2">
      <TextEditorDialog slug={thread.slug}>
        <Button variant="soft" color="gray" size="1">
          Instructions
        </Button>
      </TextEditorDialog>

      <div className="grow" />

      <div className="divide-gray-7 text-xxs flex divide-x text-right font-mono">
        {kv.map(([key, value]) => (
          <div key={key} className="px-2">
            <div className="text-gold-12">{key}</div>
            <div className="text-gold-11">{value}</div>
          </div>
        ))}
      </div>
    </PanelToolbar>
  )
}
