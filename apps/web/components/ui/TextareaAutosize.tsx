import { cn } from '@/lib/utils'
import ReactTextareaAutosize from 'react-textarea-autosize'

export const TextareaAutosize = ({
  className,
  onChange,
  onValueChange,
  ...props
}: { onValueChange?: (value: string) => unknown } & React.ComponentProps<typeof ReactTextareaAutosize>) => {
  return (
    <ReactTextareaAutosize
      minRows={1}
      rows={1}
      {...props}
      onChange={(e) => {
        onValueChange?.(e.target.value)
        onChange?.(e)
      }}
      className={cn(
        'focus-visible:outline-accent-8 flex outline-none -outline-offset-1 focus-visible:outline-2 disabled:cursor-not-allowed disabled:opacity-50',
        'placeholder:text-gray-a10 w-full resize-none rounded border bg-black/25 p-2 font-normal',
        className,
      )}
    />
  )
}
