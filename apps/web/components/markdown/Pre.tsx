import { artifactAtom } from '@/app/(artifacts)/artifacts/[id]/atoms'
import { createArtifact, extractCodeBlockText } from '@/lib/code-block'
import { cn } from '@/lib/utils'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { useAtom } from 'jotai'
import { memo, type ComponentPropsWithoutRef } from 'react'
import type { ExtraProps } from 'react-markdown'
import { toast } from 'sonner'
import { IconButton } from '../ui/Button'

type PreProps = ComponentPropsWithoutRef<'pre'> & ExtraProps

export const Pre = memo(function Pre({ node, className, ...props }: PreProps) {
  // Check if the first child is a code element
  const codeNode = node?.children[0] as { tagName?: string; properties?: { className?: string[] } }
  const isCodeBlock = codeNode?.tagName === 'code'
  const language = isCodeBlock ? codeNode?.properties?.className?.[0]?.replace('language-', '') : null

  const handleCopy = () => {
    const text = extractCodeBlockText(node)
    navigator.clipboard.writeText(text)
    toast('Copied to clipboard')
  }

  const [artifact, setArtifact] = useAtom(artifactAtom)
  const handleArtifact = () => {
    const text = extractCodeBlockText(node)
    if (language === 'svg') {
      setArtifact(createArtifact('svg', text))
    } else {
      setArtifact(createArtifact('html', text))
    }
  }

  return (
    <pre
      className={cn('bg-black-a3 text-gray-10 mb-4 mt-2 overflow-hidden rounded-lg border font-mono', className)}
      {...props}
    >
      {isCodeBlock && (
        <div className="flex-start border-gray-a3 border-b px-3 py-1">
          <span className="text-xs">{language}</span>
          <div className="grow" />
          {language && (
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
