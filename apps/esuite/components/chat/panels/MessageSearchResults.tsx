'use client'

import { useEffect, useState } from 'react'
import { useThreadTextSearchResults } from '@corale/esuite/app/lib/api/threads'
import { cn } from '@corale/esuite/app/lib/utils'
import { FishFoodIcon } from '@corale/esuite/components/icons/FishFoodIcon'
import { Message } from '@corale/esuite/components/message/Message'
import { Loader } from '@corale/esuite/components/ui/Loader'
import { PanelBody } from '@corale/esuite/components/ui/Panel'
import { ScrollArea } from '@corale/esuite/components/ui/ScrollArea'

export const MessageSearchResults = ({ threadId }: { threadId: string }) => {
  const { results, isLoading, isSkipped } = useThreadTextSearchResults(threadId)

  const [fadeOut, setFadeOut] = useState(false)
  useEffect(() => {
    if (isLoading) setFadeOut(true)
    else setFadeOut(false)
  }, [isLoading])

  return (
    <>
      {!isSkipped && (
        <PanelBody>
          <ScrollArea className="bg-gray-1">
            <div
              className={cn(
                '',
                fadeOut && 'opacity-50 transition-opacity duration-300 ease-in-out',
              )}
            >
              {results.map((message) => (
                <div key={message._id} className="mx-auto max-w-[85ch] py-3">
                  <Message message={message} />
                </div>
              ))}
            </div>

            {results.length === 0 && !isLoading ? (
              <div className="flex-col-center h-full w-full">
                <FishFoodIcon className="text-gray-10 size-36" />
                <div className="text-gray-11 text-base font-medium">No results.</div>
              </div>
            ) : null}
          </ScrollArea>
        </PanelBody>
      )}

      {isLoading && (
        <div className="absolute right-4 top-4">
          <Loader type="orbit" />
        </div>
      )}
    </>
  )
}
