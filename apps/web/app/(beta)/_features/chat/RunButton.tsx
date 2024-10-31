import { Button } from '@/components/ui/Button'
import * as Icons from '@phosphor-icons/react/dist/ssr'

export const RunButton = (props: Partial<React.ComponentProps<typeof Button>>) => {
  return (
    <Button variant="surface" {...props}>
      Run
      <CommandEnter />
    </Button>
  )
}

const CommandEnter = () => {
  return (
    <div className="bg-gray-a5 flex rounded p-0.5">
      <Icons.Command />
      <Icons.ArrowElbowDownLeft />
    </div>
  )
}
