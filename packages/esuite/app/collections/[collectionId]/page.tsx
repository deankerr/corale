import { Collection } from '@/components/collections/Collection'
import { MyImagesCollection } from '@/components/collections/MyImagesCollection'

export default async function Page(props: { params: Promise<{ collectionId: string }> }) {
  const params = await props.params;
  if (params.collectionId === 'all') {
    return <MyImagesCollection />
  }
  return <Collection collectionId={params.collectionId} />
}
