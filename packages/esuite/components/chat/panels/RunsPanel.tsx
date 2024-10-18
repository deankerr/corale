// 'use client'

// import { useListThreadRuns } from '@/lib/api/threads'
// import { PanelBody } from '@/components/ui/Panel'
// import { RunStatusBadge } from '@/components/ui/RunStatusBadge'
// import { getErrorMessage, parseJson } from '@/convex/shared/utils'

export const RunsPanel = ({ threadId, show = false }: { threadId: string; show?: boolean }) => {
  //   const runs = useListThreadRuns(threadId)
  //   if (!show) return null
  //   return (
  //     <PanelBody className="justify-self-end bg-transparent">
  //       <div className="flex-col-start h-full items-end gap-2 overflow-y-auto overflow-x-hidden bg-black-a4 p-2">
  //         {runs?.map((run) => (
  //           <div
  //             key={run._id}
  //             className="flex-col-start w-80 gap-2 rounded border bg-gray-1 px-3 py-2 text-xs"
  //           >
  //             <div className="flex-between gap-2">
  //               <RunStatusBadge status={run.status} />
  //               {run.endedAt && run.startedAt ? (
  //                 <span>{((run.endedAt - run.startedAt) / 1000).toFixed(2)}s</span>
  //               ) : null}
  //             </div>

  //             {run.errors?.map((err, i) => <div key={i}>{getErrorMessage(parseJson(err))}</div>)}

  //             <pre className="whitespace-pre-wrap border-t p-1 pt-2 font-mono text-xxs">
  //               {JSON.stringify(run, null, 2)}
  //             </pre>
  //           </div>
  //         ))}
  //       </div>
  //     </PanelBody>
  //   )
  return null
}
