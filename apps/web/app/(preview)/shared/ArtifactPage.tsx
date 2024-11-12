'use client'

import { ArtifactRenderer, type Artifact } from '@/components/artifacts/ArtifactRenderer'
import { artifactDisplayAtom } from '@/components/artifacts/atoms'
import { LoadingPage } from '@/components/pages/LoadingPage'
import { IconButton } from '@/components/ui/Button'
import { CalloutErrorBasic } from '@/components/ui/Callouts'
import { useMessageById } from '@/lib/api/messages'
import { parseCodeBlocks } from '@corale/shared/parsing/code'
import { extractHTMLTitleValue, isCompleteDocument } from '@corale/shared/parsing/html'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { useAtom } from 'jotai'
import { PageContent, PageHeader, PageLayout } from './PageLayout'

export function ArtifactPage({ params }: { params: { id: string } }) {
  const message = useMessageById(params.id)

  if (message === undefined) {
    return (
      <PageLayout>
        <PageHeader>
          <Icons.CircleNotch className="animate-spin" size={16} />
          Loading...
        </PageHeader>
        <PageContent>
          <LoadingPage />
        </PageContent>
      </PageLayout>
    )
  }

  if (message === null) {
    return (
      <PageLayout>
        <PageHeader>
          <Icons.WarningOctagon size={16} />
          Artifact
        </PageHeader>
        <PageContent>
          <CalloutErrorBasic>Artifact not found.</CalloutErrorBasic>
        </PageContent>
      </PageLayout>
    )
  }

  const artifact = getArtifact(message.text ?? '')

  if (!artifact) {
    return (
      <PageLayout>
        <PageHeader>
          <Icons.WarningOctagon size={16} />
          Artifact
        </PageHeader>
        <PageContent>
          <CalloutErrorBasic>No artifacts found.</CalloutErrorBasic>
        </PageContent>
      </PageLayout>
    )
  }

  return <ArtifactRendererPage {...artifact} />
}

export function ArtifactRendererPage({ content, language, title, onClose }: Artifact & { onClose?: () => void }) {
  const LanguageIcon = getLanguageIcon(language)

  return (
    <PageLayout>
      <PageHeader>
        <LanguageIcon size={16} aria-label={language} />
        {title}
        <div className="grow" />
        {onClose && (
          <IconButton variant="ghost" size="2" onClick={onClose} aria-label="Close">
            <Icons.X size={16} />
          </IconButton>
        )}
      </PageHeader>
      <PageContent className="p-0">
        <ArtifactRenderer content={content} language={language} />
      </PageContent>
    </PageLayout>
  )
}

export function ArtifactPreviewSidePage() {
  const [artifact, setArtifact] = useAtom(artifactDisplayAtom)
  if (!artifact) return null

  return <ArtifactRendererPage {...artifact} onClose={() => setArtifact(undefined)} />
}

const languageIcons = {
  html: Icons.FileHtml,
  svg: Icons.FileSvg,
  plaintext: Icons.FileText,
}

function getLanguageIcon(language: string) {
  return languageIcons[language as keyof typeof languageIcons] ?? Icons.FileText
}

function getArtifact(input: string): Artifact | undefined {
  const codeBlocks = parseCodeBlocks(input)

  for (const codeBlock of codeBlocks) {
    if (!isCompleteDocument(codeBlock.content, codeBlock.language)) continue

    return {
      title: extractHTMLTitleValue(codeBlock.content) ?? 'Untitled',
      language: codeBlock.language ?? 'plaintext',
      content: codeBlock.content,
    }
  }
}
