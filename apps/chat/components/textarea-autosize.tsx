import { useAutosizeTextArea } from '@ui/hooks/use-autosize-textarea'
import { cn } from '@ui/lib/utils'
import { useRef, useState } from 'react'

export const TextareaAutosize = (props: React.ComponentPropsWithoutRef<'textarea'>) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

  useAutosizeTextArea({
    ref: textAreaRef,
    maxHeight: 240,
    borderWidth: 1,
    dependencies: [props.value],
  })

  return (
    <textarea
      {...props}
      ref={textAreaRef}
      className={cn(
        'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:border-primary w-full grow resize-none rounded-lg border p-3 pr-24 text-sm transition-[border] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        props.className,
      )}
    />
  )
}
