import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Callout } from '@radix-ui/themes'

export const ErrorCallout = ({
  title,
  message,
  ...props
}: {
  title: string
  message: string
} & React.ComponentProps<typeof Callout.Root>) => {
  return (
    <Callout.Root color="red" role="alert" {...props}>
      <Callout.Icon>
        <Icons.WarningOctagon className="size-5 animate-pulse" />
      </Callout.Icon>
      <Callout.Text className="line-clamp-3">
        {title}: {message}
      </Callout.Text>
    </Callout.Root>
  )
}
