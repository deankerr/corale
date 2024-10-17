'use client'

import { useCollections } from '@/app/lib/api/collections'
import { cn } from '@/app/lib/utils'
import { CreateCollectionDialog } from '@/components/collections/dialogs'
import { NavigationButton } from '@/components/navigation/NavigationSheet'
import { NavPanel, PanelHeader, PanelTitle } from '@/components/ui/Panel'
import { ScrollArea } from '@/components/ui/ScrollArea'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button } from '@radix-ui/themes'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export const CollectionsNavPanel = () => {
  const collections = useCollections()
  const params = useParams()

  if (!collections) return null
  return (
    <NavPanel className={cn(params.collectionId && 'hidden sm:flex')}>
      <PanelHeader>
        <NavigationButton />

        <PanelTitle href="/collections">Collections</PanelTitle>

        <div className="grow" />

        <CreateCollectionDialog>
          <Button variant="surface">
            Create <Icons.Plus size={18} />
          </Button>
        </CreateCollectionDialog>
      </PanelHeader>

      <ScrollArea>
        <div className="flex flex-col gap-1 overflow-hidden p-1">
          <Link
            href={`/collections/all`}
            className={cn(
              'truncate rounded-sm px-2 py-3 text-sm font-medium hover:bg-gray-2',
              params.collectionId === 'all' && 'bg-gray-3 hover:bg-gray-3',
            )}
          >
            All
          </Link>

          {collections?.map((collection) => (
            <Link
              key={collection._id}
              href={`/collections/${collection.id}`}
              className={cn(
                'truncate rounded-sm px-2 py-3 text-sm font-medium hover:bg-gray-2',
                params.collectionId === collection.id && 'bg-gray-3 hover:bg-gray-3',
              )}
            >
              {collection.title}
            </Link>
          ))}
        </div>
      </ScrollArea>
    </NavPanel>
  )
}
