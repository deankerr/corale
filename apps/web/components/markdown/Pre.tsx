import { artifactDisplayAtom } from '@/app/(preview)/artifacts/components/atoms'
import { createArtifact, extractCodeBlockInfoFromNode } from '@/lib/code-block'
import { cn } from '@/lib/utils'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { useAtom } from 'jotai'
import { memo, type ComponentPropsWithoutRef } from 'react'
import type { ExtraProps } from 'react-markdown'
import { toast } from 'sonner'
import { IconButton } from '../ui/Button'

type PreProps = ComponentPropsWithoutRef<'pre'> & ExtraProps

export const Pre = memo(function Pre({ node, className, ...props }: PreProps) {
  const codeBlockInfo = extractCodeBlockInfoFromNode(node)
  const isCodeBlock = !!codeBlockInfo.language

  const handleCopy = () => {
    navigator.clipboard.writeText(codeBlockInfo.content)
    toast('Copied to clipboard')
  }

  const [artifact, setArtifact] = useAtom(artifactDisplayAtom)
  const handleArtifact = () => {
    if (codeBlockInfo.language === 'svg') {
      setArtifact(createArtifact('svg', codeBlockInfo.content))
    } else {
      setArtifact(createArtifact('html', codeBlockInfo.content))
    }
  }

  return (
    <pre
      className={cn('bg-black-a3 text-gray-11 mb-4 mt-2 overflow-hidden rounded-lg border font-mono', className)}
      {...props}
    >
      {isCodeBlock && (
        <div className="flex-start border-gray-a3 border-b px-3 py-1">
          <span className="text-xs">{codeBlockInfo.language}</span>
          <div className="grow" />
          {codeBlockInfo.language && (
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
