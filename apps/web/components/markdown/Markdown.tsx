import { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'

export const Markdown = memo(({ children }: { children?: string | null | undefined }) => {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={{}} className="markdown-root">
      {children}
    </ReactMarkdown>
  )
})

Markdown.displayName = 'Markdown'
