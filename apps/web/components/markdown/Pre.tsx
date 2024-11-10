import { cn } from '@/lib/utils'
import * as Icons from '@phosphor-icons/react/dist/ssr'
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
    const textNode = (node?.children[0] as any).children[0]
    const text = textNode?.value || ''
    navigator.clipboard.writeText(text)
    toast('Copied to clipboard')
  }

  return (
    <pre
      className={cn('bg-black-a3 text-gray-10 mb-4 mt-2 overflow-hidden rounded-lg border font-mono', className)}
      {...props}
    >
      {isCodeBlock && (
        <div className="flex-between border-gray-a3 border-b px-3 py-1">
          <span className="text-xs">{language}</span>
          <IconButton variant="ghost" size="1" onClick={handleCopy} aria-label="Copy code">
            <Icons.Copy />
          </IconButton>
        </div>
      )}
      {props.children}
    </pre>
  )
})
