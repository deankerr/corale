'use client'

import { useMessageFeedQuery } from '@/app/lib/api/messages'
import { twx } from '@/app/lib/utils'
import { Message } from '@/components/message/Message'
import { Loader } from '@/components/ui/Loader'
import { PanelBody } from '@/components/ui/Panel'
import { AdminOnlyUi } from '@/components/util/AdminOnlyUi'
import type { EMessage } from '@corale/api/convex/types'
import { memo, useCallback, useRef, useState } from 'react'
import { Components, ListItem, Virtuoso, VirtuosoHandle } from 'react-virtuoso'

export type MessageFeedContext = {
  status: 'LoadingFirstPage' | 'CanLoadMore' | 'LoadingMore' | 'Exhausted'
}

export const MessageFeed2 = ({ threadId }: { threadId: string }) => {
  const virtuosoRef = useRef<VirtuosoHandle>(null)
  const isScrollingRef = useRef(false)
  const lastMessageData = useRef({ _id: '', size: 0 })

  const [isAtTop, setIsAtTop] = useState(true)
  const [isAtBottom, setIsAtBottom] = useState(false)

  const { results, loadMore, status, prependedCount } = useMessageFeedQuery(threadId, 25)

  const scrollToEnd = useCallback(() => {
    if (isScrollingRef.current) return console.debug('scroll skipped')
    virtuosoRef.current?.scrollToIndex({
      index: results.length - 1,
      align: 'end',
      behavior: 'smooth',
    })
    console.debug('scrolled to end')
  }, [results.length])

  // * track last item's size, scroll to end if increased
  const handleItemsRendered = useCallback(
    (items: ListItem<EMessage>[]) => {
      const lastItemRendered = items.at(-1)
      const isLastMessage =
        lastItemRendered && lastItemRendered.originalIndex === results.length - 1
      if (!isLastMessage || !lastItemRendered.data) return

      const isSameId = lastItemRendered.data._id === lastMessageData.current._id
      const isLarger = lastItemRendered.size > lastMessageData.current.size
      if (isSameId && isLarger && isAtBottom) scrollToEnd()

      lastMessageData.current = { _id: lastItemRendered.data._id, size: lastItemRendered.size }
    },
    [isAtBottom, results.length, scrollToEnd],
  )

  const handleAtTopStateChange = useCallback(
    (atTop: boolean) => {
      setIsAtTop(atTop)
      if (atTop && status === 'CanLoadMore') {
        console.debug('load', 40)
        loadMore(40)
      }
    },
    [loadMore, status],
  )

  const handleAtBottomStateChange = useCallback((atBottom: boolean) => setIsAtBottom(atBottom), [])

  return (
    <PanelBody>
      <Virtuoso<EMessage, MessageFeedContext>
        ref={virtuosoRef}
        context={{ status }}
        components={{
          Header,
          Footer,
          List,
          EmptyPlaceholder,
        }}
        data={results}
        alignToBottom
        followOutput="smooth"
        firstItemIndex={1_000_000 - prependedCount}
        initialTopMostItemIndex={{
          index: results.length - 1,
          align: 'end',
          behavior: 'smooth',
        }}
        atTopStateChange={handleAtTopStateChange}
        atTopThreshold={1200}
        atBottomStateChange={handleAtBottomStateChange}
        atBottomThreshold={200}
        increaseViewportBy={1200}
        defaultItemHeight={900}
        computeItemKey={(_, item) => item._id}
        itemContent={(_, data) => <MemoizedMessage message={data} />}
        isScrolling={(isScrolling) => (isScrollingRef.current = isScrolling)}
        itemsRendered={handleItemsRendered}
        skipAnimationFrameInResizeObserver
      />

      {status === 'LoadingMore' && (
        <div className="absolute right-5 top-1">
          <Loader type="ring2" size={32} />
        </div>
      )}

      <AdminOnlyUi>
        <div className="absolute right-5 top-1 text-right font-mono text-xs text-gray-9">
          {isAtTop ? 'atTop' : ''} {isAtBottom ? 'atBottom' : ''} {-prependedCount} {results.length}
        </div>
      </AdminOnlyUi>
    </PanelBody>
  )
}

const MemoizedMessage = memo(({ message }: { message: EMessage }) => {
  return (
    <div className="mx-auto max-w-4xl py-2">
      <Message message={message} />
    </div>
  )
})
MemoizedMessage.displayName = 'MMessage'

const EmptyPlaceholder: Components<any, any>['EmptyPlaceholder'] = ({ context }) => (
  <div className="flex-center h-full w-full bg-gray-1">
    {context.status === 'LoadingFirstPage' && <Loader type="zoomies" />}
  </div>
)

const Header: Components<any, any>['Header'] = ({ context }) => {
  return (
    <div className="mx-auto flex max-w-3xl items-center px-1 pb-1.5 pt-3 md:px-6">
      {context.status === 'Exhausted' && (
        <div className="flex-center h-12 w-full rounded-md border text-gray-8">
          <div>This is the start of the chat.</div>
        </div>
      )}
    </div>
  )
}

const Footer: Components<any, any>['Footer'] = () => {
  return <div className="h-6"></div>
}

const List = twx.div`px-1 md:px-6`
