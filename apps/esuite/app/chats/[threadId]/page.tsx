'use client'

import { htmlTextAtom } from '@corale/esuite/components/artifacts/atoms'
import { HTMLRenderer } from '@corale/esuite/components/artifacts/HTMLRenderer'
import { Chat } from '@corale/esuite/components/chat/Chat'
import { IconButton } from '@corale/esuite/components/ui/Button'
import { Panel, PanelHeader } from '@corale/esuite/components/ui/Panel'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { useAtom } from 'jotai'

export default function Page({ params }: { params: { threadId: string } }) {
  const [htmlText, setHtmlText] = useAtom(htmlTextAtom)

  return (
    <>
      <Chat threadId={params.threadId} />

      {htmlText && (
        <Panel>
          <PanelHeader className="pl-3 pr-1">
            Artifact
            <div className="grow" />
            <IconButton aria-label="Close" variant="ghost" onClick={() => setHtmlText('')}>
              <Icons.X size={18} />
            </IconButton>
          </PanelHeader>
          <div className="grow">
            <HTMLRenderer htmlText={htmlText} />
          </div>
        </Panel>
      )}
    </>
  )
}
