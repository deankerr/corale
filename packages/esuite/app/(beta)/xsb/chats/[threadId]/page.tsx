import { XSBChat } from '@/app/(beta)/_cmp/XSBChat'

export default function Page({ params }: { params: { threadId: string } }) {
  return <XSBChat threadId={params.threadId} />
}
