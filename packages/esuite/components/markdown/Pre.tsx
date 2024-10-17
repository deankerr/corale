import { htmlTextAtom } from '@/components/artifacts/atoms'
import { IconButton } from '@/components/ui/Button'
import { AdminOnlyUi } from '@/components/util/AdminOnlyUi'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { useSetAtom } from 'jotai'
import { memo } from 'react'

export const Pre = memo(({ children, ...props }: React.ComponentProps<'pre'>) => {
  let text = ''

  if (children && typeof children === 'object' && 'props' in children) {
    if (children.props.children && typeof children.props.children === 'string') {
      text = children.props.children
    }
  }

  return (
    <pre
      {...props}
      className="group overflow-auto rounded-md bg-grayA-2 p-2 has-[code]:overflow-hidden [&>code]:block"
    >
      {children}
      <div className="absolute right-2 top-2 hidden space-x-2 group-has-[code]:block">
        <AdminOnlyUi>
          <CopyToHTMLArtifactButton text={text} />
        </AdminOnlyUi>
        <CopyToClipboardButton text={text} />
      </div>
    </pre>
  )
})

Pre.displayName = 'Pre'

const CopyToClipboardButton = ({ text }: { text: string }) => {
  return (
    <IconButton
      aria-label="Copy to clipboard"
      onClick={() => navigator.clipboard.writeText(text)}
      variant="soft"
      disabled={!text}
    >
      <Icons.Copy size={18} />
    </IconButton>
  )
}

const CopyToHTMLArtifactButton = ({ text }: { text: string }) => {
  const setHtmlText = useSetAtom(htmlTextAtom)

  return (
    <IconButton aria-label="Copy to HTML artifact" onClick={() => setHtmlText(text)} variant="soft">
      <Icons.FileHtml size={18} />
    </IconButton>
  )
}
