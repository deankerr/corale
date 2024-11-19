import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'
import { Panel, PanelContent, PanelFooter, PanelGroup, PanelHeader, PanelStack } from './Panel'

type PageProps = {
  children?: ReactNode
  className?: string
}

export function Page({ children, className }: PageProps) {
  return (
    <div className={cn('bg-background text-foreground flex h-full w-full flex-col text-sm', className)}>{children}</div>
  )
}

export function SinglePage({
  header,
  content,
  footer,
  className,
}: {
  header?: ReactNode
  content?: ReactNode
  footer?: ReactNode
  className?: string
}) {
  return (
    <Page className={className}>
      <PanelStack>
        {header && <PanelHeader>{header}</PanelHeader>}
        <PanelContent>{content}</PanelContent>
        {footer && <PanelFooter>{footer}</PanelFooter>}
      </PanelStack>
    </Page>
  )
}
