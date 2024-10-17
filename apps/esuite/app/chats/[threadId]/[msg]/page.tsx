'use client'

import { useMessage } from '@corale/esuite/app/lib/api/messages'
import { Message } from '@corale/esuite/components/message/Message'
import { Panel, PanelEmpty, PanelLoading } from '@corale/esuite/components/ui/Panel'
import { ScrollArea } from '@corale/esuite/components/ui/ScrollArea'

export default function Page({ params }: { params: { threadId: string; msg: string } }) {
  const result = useMessage(params.threadId, params.msg)

  if (!result.message) return result.message === null ? <PanelEmpty /> : <PanelLoading />

  return (
    <Panel>
      <ScrollArea>
        <div className="mx-auto max-w-[85ch] py-3">
          <Message message={result.message} />
        </div>
      </ScrollArea>
    </Panel>
  )
}
