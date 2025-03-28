'use client'

import { Button } from '@ui/components/ui/button'
import { useCopyToClipboard } from '@ui/hooks/use-copy-to-clipboard'
import { cn } from '@ui/lib/utils'
import { Check, Copy } from 'lucide-react'

type CopyButtonProps = {
  content: string
  copyMessage?: string
}

export function CopyButton({ content, copyMessage }: CopyButtonProps) {
  const { isCopied, handleCopy } = useCopyToClipboard({
    text: content,
    copyMessage,
  })

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-6 w-6"
      aria-label="Copy to clipboard"
      onClick={handleCopy}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <Check
          className={cn('h-4 w-4 transition-transform ease-in-out', isCopied ? 'scale-100' : 'scale-0')}
        />
      </div>
      <Copy className={cn('h-4 w-4 transition-transform ease-in-out', isCopied ? 'scale-0' : 'scale-100')} />
    </Button>
  )
}
