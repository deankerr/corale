import * as Icons from '@phosphor-icons/react/dist/ssr'

import { Loader } from '../ui/Loader'
import { useMessageContext } from './MessageProvider'

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

export const MessageFooter = () => {
  const { message, run } = useMessageContext()

  if (!run) return null

  const timeActive = getDuration(run.timings.startedAt, run.timings.endedAt)
  const topProvider = run.providerMetadata?.provider_name as string | undefined
  return (
    <div className="flex-end h-8 divide-x divide-grayA-3 overflow-hidden border-t border-grayA-3 px-1 font-mono text-xs text-gray-10 [&>div]:px-2.5">
      <div className="grow">
        {run.model.id} {message.kvMetadata['esuite:pattern:xid']}
      </div>

      {topProvider && <div>{topProvider}</div>}

      <div>{run.usage?.finishReason}</div>

      <div>{timeActive.toFixed(1)}s</div>
      {run.usage && (
        <div>
          {run.usage.completionTokens} / {run.usage.promptTokens} tok
        </div>
      )}
      {run.usage?.cost !== undefined && <div>${formatCost(run.usage.cost)} USD</div>}

      <div className="flex-center shrink-0">
        {run.status === 'queued' && <Loader type="ping" size={24} color="var(--gold-11)" />}
        {run.status === 'active' && <Loader type="ripples" size={24} color="var(--gold-11)" />}

        {run.status === 'done' && <Icons.Check className="size-4 text-green-10 saturate-50" />}

        {(run.status === 'failed' || run.usage?.finishReason === 'error') && (
          <Icons.WarningOctagon className="size-4 text-red-10 saturate-50" />
        )}
      </div>
    </div>
  )
}
