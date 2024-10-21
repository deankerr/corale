'use client'

import { Message } from '@/components/message/Message'
import { Panel, PanelEmpty, PanelLoading } from '@/components/ui/Panel'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { useMessageBySeries } from '@/lib/api/messages'

export default function Page({ params }: { params: { threadId: string; series: string } }) {
  const message = useMessageBySeries(params.threadId, params.series)

  if (!message) return message === null ? <PanelEmpty /> : <PanelLoading />

  return (
    <Panel>
      <ScrollArea>
        <div className="mx-auto max-w-[85ch] py-3">
          <Message message={message} />
        </div>
      </ScrollArea>
    </Panel>
  )
}
