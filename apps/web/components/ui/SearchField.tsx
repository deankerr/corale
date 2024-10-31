import { IconButton } from '@/components/ui/Button'
import { TextField, TextFieldSlot } from '@/components/ui/TextField'
import { cn } from '@/lib/utils'
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
