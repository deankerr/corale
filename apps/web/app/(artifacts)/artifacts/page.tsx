'use client'

import { api } from '@corale/backend'
import { useMutation } from 'convex/react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Composer } from './components/Composer'
import { PageContent, PageLayout } from './components/PageLayout'

export default function Page() {
  const createThread = useMutation(api.entities.threads.create)
  const createRun = useMutation(api.entities.threads.runs.create)
  const [isCreatingThread, setIsCreatingThread] = useState(false)

  const handleRunSubmit = async ({ modelId, text }: { modelId: string; text: string }) => {
    if (isCreatingThread) return
    try {
      setIsCreatingThread(true)
      const threadId = await createThread({ messages: [{ role: 'user', text }] })
      await createRun({ stream: true, threadId, model: { id: modelId } })
      console.log('threadId', threadId)
    } catch (err) {
      console.error(err)
      toast('An error occurred while trying to run the action.')
    }
  }

  return (
    <PageLayout>
      <PageContent>
        <div className="m-auto w-full max-w-3xl">
          <Composer onRunSubmit={handleRunSubmit} state={isCreatingThread ? 'pending' : 'ready'} />
        </div>
      </PageContent>
    </PageLayout>
  )
}
