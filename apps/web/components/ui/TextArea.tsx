import { cn } from '@/lib/utils'
import { forwardRef } from 'react'
import ReactTextareaAutosize, { TextareaAutosizeProps } from 'react-textarea-autosize'

type TextAreaProps = TextareaAutosizeProps & {
  onValueChange?: (value: string) => void
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ onValueChange, onChange, className, minRows = 1, ...props }, ref) => {
    return (
      <ReactTextareaAutosize
        ref={ref}
        minRows={minRows}
        rows={minRows}
        onChange={(e) => {
          onChange?.(e)
          onValueChange?.(e.target.value)
        }}
        className={cn(
          'placeholder:text-gray-7 w-full resize-none bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    )
  },
)

TextArea.displayName = 'TextArea'
