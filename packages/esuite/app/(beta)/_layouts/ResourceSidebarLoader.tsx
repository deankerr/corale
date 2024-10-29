'use client'

import { useCollections } from '@/lib/api/collections'
import { usePatterns } from '@/lib/api/patterns'
import { useThreads } from '@/lib/api/threads'
import { useParams, useSelectedLayoutSegment } from 'next/navigation'
import { ResourceListSidebar } from './sidebars/ResourceListSidebar'

export function ResourceSidebarLoader() {
  const segment = useSelectedLayoutSegment()
  const params = useParams()

  const threads = useThreads(segment === 'chats')
  const patterns = usePatterns(segment === 'patterns')
  const collections = useCollections(segment === 'collections')

  if (segment === 'chats' && threads) {
    return (
      <ResourceListSidebar
        title="Chats"
        items={threads.map((thread) => ({
          href: `/xsb/chats/${thread.xid}`,
          name: thread.model?.name ?? 'unknown',
          title: thread.title ?? 'untitled',
          time: thread.updatedAtTime,
          content: thread.latestMessage?.text?.trim() ?? '',
          isActive: thread.xid === params.threadId,
        }))}
      />
    )
  }

  if (segment === 'patterns' && patterns) {
    return (
      <ResourceListSidebar
        title="Patterns"
        items={patterns.map((pattern) => ({
          href: `/xsb/patterns/${pattern.xid}`,
          name: pattern.xid,
          title: pattern.name ?? 'untitled',
          content: pattern.description ?? '',
          isActive: pattern.xid === params.patternId,
          time: pattern.updatedAt,
        }))}
      />
    )
  }

  if (segment === 'collections' && collections) {
    return (
      <ResourceListSidebar
        title="Collections"
        items={collections.map((collection) => ({
          href: `/xsb/collections/${collection.xid}`,
          name: collection.xid,
          title: collection.title ?? 'untitled',
          content: '',
          isActive: collection.xid === params.collectionId,
          time: collection._creationTime,
        }))}
      />
    )
  }

  return null
}
