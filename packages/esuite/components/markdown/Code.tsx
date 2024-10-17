import { Code as RadixCode } from '@radix-ui/themes'
import { Highlight, themes } from 'prism-react-renderer'
import { memo } from 'react'

const SyntaxHighlighter = memo((props: Omit<React.ComponentProps<typeof Highlight>, 'children'>) => {
  return (
    <Highlight theme={themes.gruvboxMaterialDark} {...props}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <code style={style} className={`overflow-auto whitespace-pre rounded-md p-2 ${className}`}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </code>
      )}
    </Highlight>
  )
})
SyntaxHighlighter.displayName = 'SyntaxHighlighter'

export const Code = ({ children, className }: React.ComponentProps<'code'>) => {
  const match = /language-(\w+)/.exec(className || '')
  const language = match?.[1] ?? ''
  if (!language) return <code>{children}</code>

  const code = children?.toString() ?? ''
  if (!code.includes('\n')) return <RadixCode>{code}</RadixCode>

  return <SyntaxHighlighter code={code} language={language} />
}
Code.displayName = 'Code'
