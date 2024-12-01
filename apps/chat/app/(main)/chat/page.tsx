'use client'

import { Composer } from '@/components/composer/composer'
import { Panel, PanelContent, PanelHeader } from '@/components/layout/panel'
import { api } from '@corale/chat-server/api'
import { Id, type Doc } from '@corale/chat-server/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { useState } from 'react'

export default function Page() {
  const [threadSelected, setThreadSelected] = useState<Id<'threads'> | null>(null)
  const thread = useQuery(api.chat.db.getThread, threadSelected ? { threadId: threadSelected } : 'skip')
  const messages = useQuery(api.chat.db.listMessages, threadSelected ? { threadId: threadSelected } : 'skip')

  const createThread = useMutation(api.chat.db.createThread)
  const createMessage = useMutation(api.chat.db.createMessage)

  const handleSend = async (args: { text: string; model: string | null }) => {
    if (!threadSelected) {
      const threadId = await createThread({ messages: [{ text: args.text, role: 'user' }] })
      setThreadSelected(threadId)
    } else {
      await createMessage({ threadId: threadSelected, message: { text: args.text, role: 'user' } })
    }
  }

  return (
    <Panel>
      <PanelHeader>Chat {thread ? `- ${getThreadTitle(thread)}` : ''}</PanelHeader>
      <PanelContent>
        <div>
          <div className="text-sm font-medium">Messages</div>
          <div className="space-y-2 p-2">
            {messages && messages.length > 0
              ? messages.map((m) => (
                  <div key={m._id} className="border p-2">
                    <div className="font-mono text-sm font-medium">
                      {m.sequence} {m.role}
                    </div>
                    {m.text}
                  </div>
                ))
              : 'No messages'}
          </div>
        </div>
      </PanelContent>
      <div className="mx-auto w-full max-w-3xl p-3">
        <Composer onSend={handleSend} />
      </div>
    </Panel>
  )
}

function getThreadTitle(thread: Doc<'threads'>) {
  return thread.title ?? `Untitled ${Math.floor(thread._creationTime).toString().slice(-6)}`
}
