'use client'

import { ImageCardNext } from '@/components/images/ImageCardNext'
import { NavigationButton } from '@/components/navigation/NavigationSheet'
import { Button } from '@/components/ui/Button'
import { Panel, PanelHeader, PanelTitle } from '@/components/ui/Panel'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { TextField } from '@/components/ui/TextField'
import { api } from '@corale/api/convex/_generated/api'
import { useMutation, usePaginatedQuery } from 'convex/react'
import { useState } from 'react'

export default function Page() {
  const images = usePaginatedQuery(api.db.images.listAllImagesNotInCollection, {}, { initialNumItems: 100 })
  const updateCollection = useMutation(api.db.collections.update)
  const [id, setId] = useState('')

  return (
    <Panel className="w-full">
      <PanelHeader className="gap-1">
        <NavigationButton />
        <PanelTitle href="#">Images without collection</PanelTitle>
        <TextField placeholder="id" onValueChange={(value) => setId(value)} value={id} />
        <Button
          onClick={() =>
            updateCollection({
              collectionId: id,
              images_v2: {
                add: images.results.map((image) => image._id),
              },
            })
          }
        >
          Move
        </Button>
      </PanelHeader>

      <ScrollArea>
        <div className="flex flex-wrap gap-2 p-2">
          {images?.results?.map((image, index) => (
            <div key={image._id} className="w-72">
              <ImageCardNext image={image} sizes="25vw">
                <div className="absolute inset-0 cursor-pointer" />
              </ImageCardNext>
            </div>
          ))}

          {images?.results?.length === 0 && <div className="text-gray-11">No images found.</div>}
        </div>
      </ScrollArea>
    </Panel>
  )
}
