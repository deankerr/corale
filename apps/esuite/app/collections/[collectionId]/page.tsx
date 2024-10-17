import { Collection } from '@/components/collections/Collection'
import { MyImagesCollection } from '@/components/collections/MyImagesCollection'

export default function Page({ params }: { params: { collectionId: string } }) {
  if (params.collectionId === 'all') {
    return <MyImagesCollection />
  }
  return <Collection collectionId={params.collectionId} />
}
