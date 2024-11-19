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
  const [isCreatingThread, setIsCreatingThread] = useState(false)

  const createThread = useMutation(api.entities.threads.create)
  const createRun = useMutation(api.entities.threads.runs.create)

  const handleSubmit = async ({ text, modelId, patternId }: { text: string; modelId?: string; patternId?: string }) => {
    if (isCreatingThread || !text.trim()) return
    try {
      setIsCreatingThread(true)
      const threadId = await createThread({ messages: [{ role: 'user', text }] })

      if (modelId || patternId) {
        console.log('createRun', threadId, modelId, patternId)
        await createRun({
          stream: true,
          threadId,
          model: modelId && !patternId ? { id: modelId } : undefined,
          patternId,
        })
      }

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
            <Composer onSubmit={handleSubmit} state={isCreatingThread ? 'pending' : 'ready'} />
          </div>
        </PageContent>
      </PageLayout>
    </>
  )
}
