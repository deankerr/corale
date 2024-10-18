'use client'

import { SVGRenderer } from '@/components/artifacts/SVGRenderer'
import { NavigationButton } from '@/components/navigation/NavigationSheet'
import { EmptyPage } from '@/components/pages/EmptyPage'
import { Button } from '@/components/ui/Button'
import { Loader } from '@/components/ui/Loader'
import { Panel, PanelHeader, PanelLoading, PanelTitle } from '@/components/ui/Panel'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { useMessageFeedQuery } from '@/lib/api/messages'
import { useThread } from '@/lib/api/threads'
import { useMemo } from 'react'

export default function Page({ params }: { params: { threadId: string } }) {
  const thread = useThread(params.threadId)

  const { results, loadMore, status } = useMessageFeedQuery(params.threadId)

  const svgMessages = useMemo(() => {
    return results
      .slice(0, 50)
      .map((msg) => {
        const svg = extractSVG(msg.text ?? '')
        if (!svg) return null
        return {
          _id: msg._id,
          series: msg.series,
          ...svg,
        }
      })
      .filter((val) => val !== null)
      .toReversed()
  }, [results])

  if (!thread) {
    if (thread === null) return <EmptyPage />
    return <PanelLoading />
  }

  return (
    <Panel>
      <PanelHeader>
        <NavigationButton />
        <PanelTitle href={`/drawings/${thread.slug}`}>{thread.title ?? 'Untitled Thread'}</PanelTitle>
        <div className="grow" />
        {status === 'LoadingMore' && <Loader type="orbit" />}
      </PanelHeader>

      <ScrollArea>
        <div className="space-y-4">
          {svgMessages.map((msg) => (
            <div key={msg._id} className="flex-col-center">
              <SVGContainer
                _id={msg._id}
                width={msg.width}
                height={msg.height}
                title={msg.title}
                svgText={msg.svgText}
              />
              <div className="py-2 font-mono text-sm">
                {msg.series} | {msg.title}
              </div>
            </div>
          ))}
        </div>

        <div className="flex-col-center py-4">
          <Button onClick={() => loadMore(25)}>Load More</Button>
        </div>
      </ScrollArea>
    </Panel>
  )
}

type ExtractedSVG = {
  svgText: string
  width: string
  height: string
  title: string
}

const SVGContainer = ({
  svgText,
  width,
  height,
  title,
}: {
  _id: string
} & ExtractedSVG) => {
  return (
    <div className="flex-center overflow-hidden p-1" style={{ width, height }} title={title}>
      <SVGRenderer svgText={svgText} sanitize={false} />
    </div>
  )
}

const extractSVG = (text: string) => {
  const svgRegex = /```svg\n([\s\S]*?)\n```/g
  const match = svgRegex.exec(text)

  if (!match) return null

  const svgContent = match[1] as string
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgContent, 'image/svg+xml')
  const svgElement = doc.querySelector('svg')

  if (!svgElement) return null

  const width = svgElement.getAttribute('width') || ''
  const height = svgElement.getAttribute('height') || ''
  const title = svgElement.querySelector('title')?.textContent || ''

  return {
    width,
    height,
    title,
    svgText: svgContent.trim(),
  }
}
