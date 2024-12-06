import { Button } from '@corale/ui/components/ui/button'
import { useEffect, useState } from 'react'
import { useInputAtom } from '../chat-thread/store'
import { ComboBoxResponsive } from '../model-picker/model-picker'
import { TextareaAutosize } from '../textarea-autosize'

export const Composer = (props: {
  threadId: string
  onSend?: (args: { text: string; model?: string }) => Promise<void>
  defaultModel?: string
}) => {
  const [text, setText] = useInputAtom(props.threadId, 'composer')
  const [model, setModel] = useState<string | null>(props.defaultModel ?? null)

  const handleRun = () => {
    props.onSend?.({ text, model: model || undefined })
    setText('')
  }

  useEffect(() => {
    if (props.defaultModel) setModel(props.defaultModel)
  }, [props.defaultModel])

  return (
    <div className="bg-background w-full overflow-hidden rounded-md border shadow-xl">
      <TextareaAutosize
        className="resize-none border-none"
        borderWidth={0}
        placeholder="Where do you want to go today?"
        rows={1}
        value={text}
        onValueChange={setText}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            handleRun()
          }
        }}
      />

      <div className="flex p-2 pt-0">
        <ComboBoxResponsive model={model} setModel={setModel} />
        <div className="mx-1 grow" />
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => props.onSend?.({ text, model: undefined })}>
            Add
          </Button>
          <Button onClick={handleRun} className="">
            Run
          </Button>
        </div>
      </div>
    </div>
  )
}
