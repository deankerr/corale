import { Badge as BadgePrimitive } from '@radix-ui/themes'

const endpointNames: Record<string, React.ReactNode> = {
  openai: 'openai.com',
  openrouter: 'openrouter.ai',
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

export const Badge = ({ children, ...props }: React.ComponentProps<typeof BadgePrimitive>) => {
  return (
    <BadgePrimitive {...props}>
      {typeof children === 'string' && endpointNames[children] ? endpointNames[children] : children}
    </BadgePrimitive>
  )
}
