import ChatWithArtifactsPage from '../components/ChatWithArtifactsPage'

export default function Page({ params }: { params: { id: string } }) {
  return <ChatWithArtifactsPage threadId={params.id} />
}
