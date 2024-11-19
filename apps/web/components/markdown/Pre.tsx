import { artifactDisplayAtom } from '@/components/artifacts/atoms'
import { cn } from '@/lib/utils'
import { parseCodeBlockFromNode } from '@corale/shared/parsing/code'
import { extractHTMLTitleValue } from '@corale/shared/parsing/html'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { useSetAtom } from 'jotai'
import { memo, type ComponentPropsWithoutRef } from 'react'
import type { ExtraProps } from 'react-markdown'
import { toast } from 'sonner'
import { IconButton } from '../ui/Button'
import MermaidRenderer from './MermaidRenderer'

type PreProps = ComponentPropsWithoutRef<'pre'> & ExtraProps

export const Pre = memo(function Pre({ node, className, ...props }: PreProps) {
  const codeBlock = parseCodeBlockFromNode(node)
  const isCodeBlock = !!codeBlock.language

  const handleCopy = () => {
    navigator.clipboard
      .writeText(codeBlock.content)
      .then(() => {
        toast('Copied to clipboard')
      })
      .catch((error) => {
        toast.error('Failed to copy to clipboard')
        console.error('Clipboard copy failed:', error)
      })
  }

  const setArtifact = useSetAtom(artifactDisplayAtom)
  const handleArtifact = () => {
    setArtifact({
      language: codeBlock.language ?? 'plaintext',
      content: codeBlock.content,
      title: extractHTMLTitleValue(codeBlock.content) ?? 'Code Block',
      version: 'v1',
    })
  }

  // Handle mermaid diagrams
  if (codeBlock.language?.toLowerCase() === 'mermaid') {
    return <MermaidRenderer content={codeBlock.content} />
  }

  return (
    <pre
      className={cn('bg-black-a3 text-gray-11 mb-4 mt-2 overflow-hidden rounded-lg border font-mono', className)}
      {...props}
    >
      {isCodeBlock && (
        <div className="flex-start border-gray-a3 border-b px-3 py-1">
          <span className="text-xs">{codeBlock.language}</span>
          <div className="grow" />
          {codeBlock.language && (
            <IconButton variant="ghost" size="1" onClick={handleArtifact} aria-label="Save as artifact">
              <Icons.Graph />
            </IconButton>
          )}
          <IconButton variant="ghost" size="1" onClick={handleCopy} aria-label="Copy code">
            <Icons.Copy />
          </IconButton>
        </div>
      )}
      {props.children}
    </pre>
  )
})
