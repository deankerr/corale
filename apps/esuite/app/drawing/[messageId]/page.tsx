'use client'

import { useMemo } from 'react'
import { useMessageById } from '@corale/esuite/app/lib/api/messages'
import { SVGRenderer } from '@corale/esuite/components/artifacts/SVGRenderer'
import { EmptyPage } from '@corale/esuite/components/pages/EmptyPage'
import { LoadingPage } from '@corale/esuite/components/pages/LoadingPage'
import { Panel } from '@corale/esuite/components/ui/Panel'
import { ScrollArea } from '@corale/esuite/components/ui/ScrollArea'

const extractSVGCodeblocks = (messageText: string): string[] => {
  const svgRegex = /```svg\n([\s\S]*?)\n```/g
  const matches = Array.from(messageText.matchAll(svgRegex))
  return matches.map((match) => match[1] ?? '').filter((svg) => svg.trim() !== '')
}

export default function Page({ params }: { params: { messageId: string } }) {
  const message = useMessageById(params.messageId)

  const svgContents = useMemo(() => {
    if (message?.text) {
      return extractSVGCodeblocks(message.text)
    }
    return []
  }, [message?.text])

  if (!message) {
    return <Panel>{message === null ? <EmptyPage /> : <LoadingPage />}</Panel>
  }

  return (
    <Panel>
      <ScrollArea>
        <div className="flex-col-center h-full gap-4">
          {svgContents.length > 0 ? (
            svgContents.map((svg, index) => (
              <SVGRenderer key={index} svgText={svg} sanitize={false} />
            ))
          ) : (
            <p className="text-gray-600">No SVG content found in the message.</p>
          )}
        </div>
      </ScrollArea>
    </Panel>
  )
}
