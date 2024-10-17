import { Collection } from '@corale/esuite/components/collections/Collection'
import { MyImagesCollection } from '@corale/esuite/components/collections/MyImagesCollection'

export default function Page({ params }: { params: { collectionId: string } }) {
  if (params.collectionId === 'all') {
    return <MyImagesCollection />
  }
  return <Collection collectionId={params.collectionId} />
}
