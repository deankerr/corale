'use client'

import { ArtifactRenderer } from '@/components/artifacts/ArtifactRenderer'
import { useMessageById } from '@/lib/api/messages'
import { extractCodeBlocks } from '@/lib/code-block'
import { PageContent, PageHeader, PageLayout } from '../../shared/PageLayout'

export default function Page({ params }: { params: { id: string } }) {
  const message = useMessageById(params.id)
  const codeBlocks = extractCodeBlocks(message?.text ?? '')

  const codeBlock = codeBlocks?.[0]
  const title = codeBlock ? codeBlock.title : 'Artifact'

  return (
    <PageLayout>
      <PageHeader className="border-border">{title}</PageHeader>
      <PageContent className="items-center justify-center p-0">
        {codeBlock && <ArtifactRenderer content={codeBlock.content} language={codeBlock.language ?? ''} />}
      </PageContent>
    </PageLayout>
  )
}
