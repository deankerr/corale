import { TextField as RxTextField } from '@radix-ui/themes'
import { forwardRef } from 'react'

type TextFieldProps = { onValueChange?: (value: string) => unknown } & React.ComponentProps<typeof RxTextField.Root>

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { onValueChange, onChange, ...props },
  forwardedRef,
) {
  return (
    <RxTextField.Root
      size={{ initial: '3', sm: '2' }}
      {...props}
      onChange={(e) => {
        onValueChange?.(e.target.value)
        onChange?.(e)
      }}
      ref={forwardedRef}
    />
  )
})

export const TextFieldSlot = RxTextField.Slot
