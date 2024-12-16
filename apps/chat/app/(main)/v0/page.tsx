'use client'

import { Panel, PanelContent, PanelHeader } from '@/components/layout/panel'
import { api } from '@corale/chat-server/api'
import { Button } from '@ui/components/ui/button'
import { useMutation, useQuery } from 'convex/react'
import Link from 'next/link'

export default function Page() {
  const trees = useQuery(api.v0.trees.list, {})
  const createTree = useMutation(api.v0.trees.create)

  return (
    <Panel>
      <PanelHeader>Trees</PanelHeader>
      <PanelContent>
        <div>
          <Button onClick={() => createTree({})}>Create Tree</Button>

          <div className="flex flex-col gap-2 p-2">
            {trees?.map((tree) => (
              <div key={tree.id} className="mt-1">
                <Link href={`/v0/${tree.id}`}>{tree.label || `Tree ${tree.id}`}</Link>
              </div>
            ))}
          </div>
        </div>
      </PanelContent>
    </Panel>
  )
}
