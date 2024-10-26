'use client'

import { SVGRenderer } from '@/components/artifacts/SVGRenderer'
import { EmptyPage } from '@/components/pages/EmptyPage'
import { LoadingPage } from '@/components/pages/LoadingPage'
import { Panel } from '@/components/ui/Panel'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { useMessageById } from '@/lib/api/messages'
import { useMemo, use } from 'react';

const extractSVGCodeblocks = (messageText: string): string[] => {
  const svgRegex = /```svg\n([\s\S]*?)\n```/g
  const matches = Array.from(messageText.matchAll(svgRegex))
  return matches.map((match) => match[1] ?? '').filter((svg) => svg.trim() !== '')
}

export default function Page(props: { params: Promise<{ messageId: string }> }) {
  const params = use(props.params);
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
            svgContents.map((svg, index) => <SVGRenderer key={index} svgText={svg} sanitize={false} />)
          ) : (
            <p className="text-gray-600">No SVG content found in the message.</p>
          )}
        </div>
      </ScrollArea>
    </Panel>
  )
}
