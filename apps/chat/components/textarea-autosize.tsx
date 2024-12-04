import { useAutosizeTextArea } from '@ui/hooks/use-autosize-textarea'
import { cn } from '@ui/lib/utils'
import { useRef } from 'react'

export const TextareaAutosize = ({
  onChange,
  onValueChange,
  borderWidth = 1,
  ...props
}: React.ComponentPropsWithoutRef<'textarea'> & {
  onValueChange?: (value: string) => void
  borderWidth?: number
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

  useAutosizeTextArea({
    ref: textAreaRef,
    maxHeight: 260,
    borderWidth,
    dependencies: [props.value],
  })

  return (
    <textarea
      {...props}
      ref={textAreaRef}
      onChange={(e) => {
        onChange?.(e)
        onValueChange?.(e.target.value)
      }}
      className={cn(
        'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:border-primary w-full grow resize-none rounded-lg border p-3 transition-[border] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        props.className,
      )}
    />
  )
}
