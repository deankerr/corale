'use client'

import { Button } from '@/components/ui/Button'
import { Loader } from '@/components/ui/Loader'
import { api } from '@corale/api/convex/_generated/api'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { usePaginatedQuery } from 'convex/react'
import { AdminPageWrapper } from '../admin-utils'

const formatCost = (value: number) => {
  const absValue = Math.abs(value)
  const firstNonZeroIndex = absValue.toString().split('.')[1]?.search(/[1-9]/) ?? -1
  const maximumFractionDigits = firstNonZeroIndex === -1 ? 2 : Math.max(2, firstNonZeroIndex + 1)

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    maximumFractionDigits,
    minimumFractionDigits: 2,
  })
  return formatter.format(value)
}

function getDuration(startTime = 0, endTime = Date.now()) {
  return (endTime - startTime) / 1000
}

export default function Page() {
  const runs = usePaginatedQuery(api.db.admin.runs.list, {}, { initialNumItems: 50 })

  return (
    <AdminPageWrapper className="w-full">
      <div className="w-full overflow-x-auto">
        <table className="text-gray-10 w-full text-left text-xs">
          <thead>
            <tr className="bg-gray-3 text-gray-11">
              <th className="p-2">User</th>
              <th className="p-2">Thread</th>
              <th className="p-2">Model</th>
              <th className="p-2">Pattern</th>
              <th className="p-2">Provider</th>
              <th className="p-2">Finish</th>
              <th className="p-2">TTFT</th>
              <th className="p-2">Time</th>
              <th className="p-2">Tok Out</th>
              <th className="p-2">Tok In</th>
              <th className="p-2">Cost</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {runs.results.map((run) => {
              const timeActive = run.timings.endedAt
                ? getDuration(run.timings.startedAt, run.timings.endedAt)
                : undefined
              const timeToFirstToken = run.timings.firstTokenAt
                ? getDuration(run.timings.startedAt, run.timings.firstTokenAt)
                : undefined
              const topProvider = run.providerMetadata?.provider_name as string | undefined

              return (
                <tr key={run.xid} className="border-gray-3 border-b font-mono">
                  <td className="p-2 text-xs">{run.username}</td>
                  <td className="p-2 text-xs">{run.threadTitle}</td>
                  <td className="p-2 text-xs">{run.model.id}</td>
                  <td className="p-2 text-xs">{run.pattern?.name ?? '-'}</td>
                  <td className="p-2">{topProvider ?? '-'}</td>
                  <td className="p-2">{run.usage?.finishReason ?? '-'}</td>
                  <td className="p-2 text-right">
                    {timeToFirstToken !== undefined ? `${timeToFirstToken.toFixed(1)}s` : '-'}
                  </td>
                  <td className="p-2 text-right">{timeActive !== undefined ? `${timeActive.toFixed(1)}s` : '-'}</td>
                  <td className="p-2 text-right">{run.usage ? `${run.usage.completionTokens}` : '-'}</td>
                  <td className="p-2 text-right">{run.usage ? `${run.usage.promptTokens}` : '-'}</td>
                  <td className="p-2">{run.usage?.cost !== undefined ? `$${formatCost(run.usage.cost)}` : '-'}</td>
                  <td className="flex-center p-2">
                    {run.status === 'queued' && <Loader type="ping" size={24} color="var(--gold-11)" />}
                    {run.status === 'active' && <Loader type="ripples" size={24} color="var(--gold-11)" />}
                    {run.status === 'done' && <Icons.Check className="text-green-10 size-4 saturate-50" />}
                    {(run.status === 'failed' || run.usage?.finishReason === 'error') && (
                      <Icons.WarningOctagon className="text-red-10 size-4 saturate-50" />
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className="flex-center w-full p-2">
          <Button variant="surface" onClick={() => runs.loadMore(200)} disabled={runs.status !== 'CanLoadMore'}>
            Load more
          </Button>
        </div>
      </div>
    </AdminPageWrapper>
  )
}
