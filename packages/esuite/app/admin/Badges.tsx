import { Badge } from '@radix-ui/themes'
import { accentColors } from '@radix-ui/themes/props'

const endpointColors: Record<string, (typeof accentColors)[number]> = {
  openrouter: 'violet',
  openai: 'teal',
  together: 'sky',
  fal: 'purple',
  sinkin: 'teal',

  civitai: 'blue',
  huggingface: 'yellow',
}

const endpointNames: Record<string, React.ReactNode> = {
  together: 'together.ai',
  sinkin: 'sinkin.ai',
  fal: 'fal.ai',
  civitai: (
    <span>
      <span className="text-gray-12">civit</span>ai
    </span>
  ),
  huggingface: '🤗 hf',
}

export const endpointTokens = (endpoint: string) => {
  return {
    color: endpointColors[endpoint],
    name: endpointNames[endpoint] ?? endpoint,
  }
}

export const EndpointBadge = ({ endpoint, ...props }: { endpoint: string } & React.ComponentProps<typeof Badge>) => {
  return (
    <Badge color={endpointTokens(endpoint).color} {...props}>
      {endpointTokens(endpoint).name}
    </Badge>
  )
}
