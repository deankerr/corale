'use client'

import { api } from '@corale/backend'
import { useMutation } from 'convex/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { PageContent, PageLayout } from '../shared/PageLayout'
import { ArtifactThreadsList } from './components/ArtifactThreadsList'
import { Composer } from './components/Composer'

export default function Page() {
  const router = useRouter()
  const createThread = useMutation(api.entities.threads.create)
  const createRun = useMutation(api.entities.threads.runs.create)
  const [isCreatingThread, setIsCreatingThread] = useState(false)

  const handleRunSubmit = async ({ modelId, text }: { modelId?: string; text: string }) => {
    if (isCreatingThread || !modelId) return
    try {
      setIsCreatingThread(true)
      const threadId = await createThread({ messages: [{ role: 'user', text }] })
      await createRun({ stream: true, threadId, model: { id: modelId } })
      router.push(`/artifacts/${threadId}`)
    } catch (err) {
      console.error(err)
      toast('An error occurred while trying to run the action.')
      setIsCreatingThread(false)
    }
  }

  return (
    <>
      <ArtifactThreadsList />
      <PageLayout>
        <PageContent>
          <div className="m-auto w-full max-w-2xl">
            <Composer onSubmit={handleRunSubmit} state={isCreatingThread ? 'pending' : 'ready'} />
          </div>
        </PageContent>
      </PageLayout>
    </>
  )
}
