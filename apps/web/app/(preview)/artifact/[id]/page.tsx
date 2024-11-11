'use client'

import { ArtifactRenderer } from '@/components/artifacts/ArtifactRenderer'
import { useMessageById } from '@/lib/api/messages'
import { extractCodeBlocks } from '@/lib/code-block'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { PageContent, PageHeader, PageLayout } from '../../shared/PageLayout'

export default function Page({ params }: { params: { id: string } }) {
  const message = useMessageById(params.id)
  const codeBlocks = extractCodeBlocks(message?.text ?? '')

  const codeBlock = codeBlocks?.[0]
  const title = codeBlock ? codeBlock.title : 'Artifact'
  const language = codeBlock?.language ?? 'plaintext'

  return (
    <PageLayout>
      <PageHeader className="border-border">
        <Icons.CodeBlock size={18} />
        {title} ({language})
      </PageHeader>
      <PageContent className="p-0">
        {codeBlock && <ArtifactRenderer content={codeBlock.content} language={codeBlock.language ?? ''} />}
      </PageContent>
    </PageLayout>
  )
}
