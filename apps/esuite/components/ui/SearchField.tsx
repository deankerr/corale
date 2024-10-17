import { cn } from '@corale/esuite/app/lib/utils'
import { IconButton } from '@corale/esuite/components/ui/Button'
import { TextField, TextFieldSlot } from '@corale/esuite/components/ui/TextField'
import * as Icons from '@phosphor-icons/react/dist/ssr'

export const SearchField = (props: React.ComponentProps<typeof TextField>) => {
  return (
    <TextField {...props}>
      <TextFieldSlot>
        <Icons.MagnifyingGlass className="size-4 shrink-0 opacity-50" />
      </TextFieldSlot>

      <TextFieldSlot>
        <IconButton
          variant="ghost"
          size="1"
          aria-label="Clear search"
          className={cn('invisible', props.value && 'visible')}
          onClick={() => {
            props.onValueChange?.('')
          }}
        >
          <Icons.X size={16} />
        </IconButton>
      </TextFieldSlot>
    </TextField>
  )
}
