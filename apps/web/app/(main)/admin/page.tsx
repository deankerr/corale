'use client'

import { ScrollArea } from '@/components/ui/ScrollArea'
import { useCachedQuery } from '@/lib/api/helpers'
import { useChatModels } from '@/lib/api/models'
import { api } from '@corale/backend'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Badge, BadgeProps, Card, Heading } from '@radix-ui/themes'
import { AdminPageWrapper } from './admin-utils'

export default function Page() {
  const events = useCachedQuery(api.entities.operationsEventLogs.public.latest, { limit: 100 })
  const chatModels = useChatModels()

  return (
    <AdminPageWrapper>
      <Card className="max-w-2xl shrink-0">
        <Heading size="5" className="flex items-center gap-2">
          <Icons.Info className="size-6" />
          Models
        </Heading>

        <div className="flex-start gap-2">
          <div className="flex gap-1 py-2">
            <Badge color="green">Chat</Badge>
            <div className="text-sm">{chatModels?.length ?? '...'}</div>
          </div>
        </div>
      </Card>

      <Card className="max-w-2xl">
        <Heading size="5" className="flex items-center gap-2">
          <Icons.Info className="size-6" />
          Events
        </Heading>

        <ScrollArea>
          <div className="divide-y">
            {events?.map((event) => (
              <div key={event._id}>
                <div className="flex gap-1 py-2">
                  <div className="w-20 shrink-0 text-xs" suppressHydrationWarning>
                    {new Date(event._creationTime).toLocaleString()}
                  </div>

                  <Badge color={eventTypeColors[event.type]}>{event.type}</Badge>

                  <div className="text-sm">{event.message}</div>
                </div>
                {event.data ? (
                  <pre className="flex-none overflow-x-auto whitespace-pre-wrap p-2 text-xs">
                    {JSON.stringify({ before: event.data.before, after: event.data.after }, null, 2).slice(
                      2,
                      -2,
                    )}
                  </pre>
                ) : null}
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </AdminPageWrapper>
  )
}

const eventTypeColors: Record<string, BadgeProps['color']> = {
  error: 'red',
  warning: 'yellow',
  notice: 'blue',
  info: 'green',
  debug: 'gray',
}
