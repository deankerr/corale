import { Text } from '@radix-ui/themes'
import { memo, type JSX, type JSXElementConstructor } from 'react'
import ReactMarkdown, { type Components, type ExtraProps } from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import { Pre } from './Pre'

type WithExtraProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
  React.ComponentProps<T> & ExtraProps

const components: Components = {
  h1: ({ node, color, ...props }: WithExtraProps<'h1'>) => (
    <Text as="div" size="6" weight="bold" mt="2" mb="5" {...props} />
  ),
  h2: ({ node, color, ...props }: WithExtraProps<'h2'>) => (
    <Text as="div" size="5" weight="bold" mt="3" {...props} />
  ),
  h3: ({ node, color, ...props }: WithExtraProps<'h3'>) => (
    <Text as="div" size="4" weight="medium" mt="2" {...props} />
  ),
  h4: ({ node, color, ...props }: WithExtraProps<'h4'>) => (
    <Text as="div" size="3" weight="medium" mt="2" {...props} />
  ),
  h5: ({ node, color, ...props }: WithExtraProps<'h5'>) => (
    <Text as="div" size="2" weight="medium" mt="2" {...props} />
  ),
  h6: ({ node, color, ...props }: WithExtraProps<'h6'>) => (
    <Text as="div" size="1" weight="medium" mt="2" {...props} />
  ),
  pre: Pre as Components['pre'],
}

export const Markdown = memo(({ children }: { children?: string | null | undefined }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      components={components}
      className="markdown-root"
    >
      {children}
    </ReactMarkdown>
  )
})

Markdown.displayName = 'Markdown'
