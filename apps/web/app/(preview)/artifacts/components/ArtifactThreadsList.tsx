'use client'

import { useThreads } from '@/lib/api/threads'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { useParams } from 'next/navigation'
import { ResourceListSidebar } from './ResourceListSidebar'

export const ArtifactThreadsList = () => {
  const params = useParams()
  const threads = useThreads() ?? []

  return (
    <ResourceListSidebar
      title="Artifacts"
      icon={Icons.CodeBlock}
      path="/artifacts"
      items={threads.map((thread) => ({
        path: `/artifacts/${thread.xid}`,
        name: thread.model?.name ?? 'unknown',
        title: thread.title ?? 'untitled',
        time: thread.updatedAtTime,
        content: thread.latestMessage?.text?.trim() ?? '',
        isActive: thread.xid === params.id,
      }))}
    />
  )
}
